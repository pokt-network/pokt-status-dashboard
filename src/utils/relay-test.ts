import "server-only";

import { createClient, getLatestBlockNumber } from "@/utils/clients";
import { getRpcEndpointsFromEnv, RpcEndpoint } from "@/utils/rpc-endpoints";
import { Chain } from "@/utils/types";

const COVERAGE_TTL_MS = parsePositiveInt(
  process.env.RELAY_TEST_COVERAGE_TTL_MS,
  15 * 60 * 1000,
);
const HEALTH_CHECK_TIMEOUT_MS = parsePositiveInt(
  process.env.RELAY_TEST_HEALTH_TIMEOUT_MS,
  2_500,
);
const ENDPOINT_TEST_TIMEOUT_MS = parsePositiveInt(
  process.env.RELAY_TEST_ENDPOINT_TIMEOUT_MS,
  4_000,
);
const ENDPOINT_TEST_CONCURRENCY = parsePositiveInt(
  process.env.RELAY_TEST_ENDPOINT_CONCURRENCY,
  3,
);

export type RelayTestResult = {
  blockNumber: bigint | null;
  status: "success" | "error";
  latency: number;
};

type EndpointCoverage = {
  endpoint: RpcEndpoint;
  configuredServiceIDs: Set<string>;
};

type EndpointRelayResponse = {
  result: RelayTestResult;
};

type CoverageCacheEntry = {
  coverage: Map<string, RpcEndpoint[]>;
  expiresAt: number;
};

let coverageCache: CoverageCacheEntry | null = null;
let coverageRefreshPromise: Promise<Map<string, RpcEndpoint[]>> | null = null;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(id);
        resolve(value);
      },
      (error) => {
        clearTimeout(id);
        reject(error);
      },
    );
  });
}

async function fetchWithAbortTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) {
    return [];
  }

  const safeConcurrency = Math.max(1, Math.min(concurrency, items.length));
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: safeConcurrency }, async () => {
      while (true) {
        const index = nextIndex;
        nextIndex += 1;

        if (index >= items.length) {
          return;
        }

        results[index] = await worker(items[index], index);
      }
    }),
  );

  return results;
}

function toBlockNumber(value: unknown): bigint | null {
  try {
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return BigInt(Math.floor(value));
    }
    if (typeof value === "string" && value.trim().length > 0) {
      return BigInt(value);
    }
  } catch {
    return null;
  }

  return null;
}

async function fetchEndpointCoverage(
  endpoint: RpcEndpoint,
): Promise<EndpointCoverage | null> {
  try {
    const response = await fetchWithAbortTimeout(
      endpoint.healthUrl,
      { cache: "no-store" },
      HEALTH_CHECK_TIMEOUT_MS,
    );
    if (!response.ok) {
      console.warn(
        `[relay-test] Health check failed for '${endpoint.name}' with HTTP ${response.status}`,
      );
      return null;
    }

    const data = (await response.json()) as { configuredServiceIDs?: string[] };
    const configuredServiceIDs = new Set(data.configuredServiceIDs || []);

    return { endpoint, configuredServiceIDs };
  } catch (error) {
    console.warn(
      `[relay-test] Health check failed for '${endpoint.name}':`,
      (error as Error).message,
    );
    return null;
  }
}

async function runRelayTestWithEndpoint(
  chain: Chain,
  endpoint: RpcEndpoint,
): Promise<EndpointRelayResponse> {
  let client: Awaited<ReturnType<typeof createClient>> | null = null;

  try {
    client = await createClient(
      endpoint.rpcUrl,
      chain.type,
      chain.serviceId,
      endpoint.apiKey,
    );
  } catch (error) {
    console.error(error);
    return {
      result: {
        blockNumber: null,
        status: "error",
        latency: 0,
      },
    };
  }

  const startTime = performance.now();
  try {
    const result = await getLatestBlockNumber(client);
    const blockNumber = toBlockNumber(result);
    const endTime = performance.now();

    if (blockNumber === null) {
      return {
        result: {
          blockNumber: null,
          status: "error",
          latency: Math.round(endTime - startTime),
        },
      };
    }

    return {
      result: {
        blockNumber,
        status: "success",
        latency: Math.round(endTime - startTime),
      },
    };
  } catch (error) {
    console.error(error);
    const endTime = performance.now();
    return {
      result: {
        blockNumber: null,
        status: "error",
        latency: Math.round(endTime - startTime),
      },
    };
  }
}

async function performRelayTestWithEndpoint(
  chain: Chain,
  endpoint: RpcEndpoint,
): Promise<EndpointRelayResponse> {
  try {
    return await withTimeout(
      runRelayTestWithEndpoint(chain, endpoint),
      ENDPOINT_TEST_TIMEOUT_MS,
    );
  } catch (error) {
    console.error(
      `[relay-test] Endpoint test timeout/failure for '${endpoint.name}' on '${chain.serviceId}':`,
      (error as Error).message,
    );
    return {
      result: {
        blockNumber: null,
        status: "error",
        latency: ENDPOINT_TEST_TIMEOUT_MS,
      },
    };
  }
}

function buildCoverageByServiceId(
  coverageList: EndpointCoverage[],
): Map<string, RpcEndpoint[]> {
  const coverageByServiceId = new Map<string, RpcEndpoint[]>();

  for (const coverage of coverageList) {
    for (const serviceId of coverage.configuredServiceIDs) {
      const current = coverageByServiceId.get(serviceId) || [];
      current.push(coverage.endpoint);
      coverageByServiceId.set(serviceId, current);
    }
  }

  return coverageByServiceId;
}

async function computeCoverageByServiceId(): Promise<Map<string, RpcEndpoint[]>> {
  const endpoints = getRpcEndpointsFromEnv();
  const coverage = await mapWithConcurrency(
    endpoints,
    Math.min(4, endpoints.length),
    (endpoint) => fetchEndpointCoverage(endpoint),
  );

  const validCoverage = coverage.filter(
    (entry): entry is EndpointCoverage => entry !== null,
  );

  return buildCoverageByServiceId(validCoverage);
}

async function refreshCoverageCache(): Promise<Map<string, RpcEndpoint[]>> {
  if (!coverageRefreshPromise) {
    coverageRefreshPromise = computeCoverageByServiceId()
      .then((coverage) => {
        coverageCache = {
          coverage,
          expiresAt: Date.now() + COVERAGE_TTL_MS,
        };
        return coverage;
      })
      .finally(() => {
        coverageRefreshPromise = null;
      });
  }

  return coverageRefreshPromise;
}

export async function getCoverageByServiceId(): Promise<
  Map<string, RpcEndpoint[]>
> {
  const now = Date.now();
  if (coverageCache && now < coverageCache.expiresAt) {
    return coverageCache.coverage;
  }

  if (coverageCache) {
    void refreshCoverageCache().catch((error) => {
      console.warn(
        "[relay-test] Coverage cache refresh failed; continuing with stale coverage:",
        (error as Error).message,
      );
    });
    return coverageCache.coverage;
  }

  return refreshCoverageCache();
}

export async function performRelayTestForChain(
  chain: Chain,
  candidateEndpoints: RpcEndpoint[],
): Promise<RelayTestResult> {
  if (candidateEndpoints.length === 0) {
    return {
      blockNumber: null,
      status: "error",
      latency: 0,
    };
  }

  const responses = await mapWithConcurrency(
    candidateEndpoints,
    ENDPOINT_TEST_CONCURRENCY,
    (endpoint) => performRelayTestWithEndpoint(chain, endpoint),
  );

  const successfulResponses = responses.filter(
    (response) => response.result.status === "success",
  );

  if (successfulResponses.length === 0) {
    return {
      blockNumber: null,
      status: "error",
      latency: 0,
    };
  }

  const fastestResponse = successfulResponses.reduce((best, current) => {
    return current.result.latency < best.result.latency ? current : best;
  });

  return fastestResponse.result;
}
