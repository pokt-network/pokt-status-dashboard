import "server-only";

import { createClient, getLatestBlockNumber } from "@/utils/clients";
import { getRpcEndpointsFromEnv, RpcEndpoint } from "@/utils/rpc-endpoints";
import { Chain } from "@/utils/types";

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
    const response = await fetch(endpoint.healthUrl, { cache: "no-store" });
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

async function performRelayTestWithEndpoint(
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
    const endTime = performance.now();
    return {
      result: {
        blockNumber: toBlockNumber(result),
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

export async function getCoverageByServiceId(): Promise<
  Map<string, RpcEndpoint[]>
> {
  const endpoints = getRpcEndpointsFromEnv();
  const coverage = await Promise.all(
    endpoints.map((endpoint) => fetchEndpointCoverage(endpoint)),
  );

  const validCoverage = coverage.filter(
    (entry): entry is EndpointCoverage => entry !== null,
  );

  return buildCoverageByServiceId(validCoverage);
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

  const responses = await Promise.all(
    candidateEndpoints.map((endpoint) =>
      performRelayTestWithEndpoint(chain, endpoint),
    ),
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
