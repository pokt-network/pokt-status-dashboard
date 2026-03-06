import "server-only";

import servicesJson from "@/data/services.json";
import {
  getCoverageByServiceId,
  mapWithConcurrency,
  performRelayTestForChain,
} from "@/utils/relay-test";
import { Chain } from "@/utils/types";

const RESPONSE_TTL_MS = parsePositiveInt(
  process.env.RELAY_TEST_RESPONSE_TTL_MS,
  5 * 60 * 1000,
);
const CHAIN_TEST_CONCURRENCY = parsePositiveInt(
  process.env.RELAY_TEST_CHAIN_CONCURRENCY,
  8,
);

export type RelayApiRow = {
  label: string;
  serviceId: string;
  chain: string;
  type: string;
  blockNumber: string | undefined;
  status: "success" | "error";
  latency: number;
};

type RelayResponseCache = {
  result: RelayApiRow[];
  expiresAt: number;
};

let relayResponseCache: RelayResponseCache | null = null;
let relayResponseRefreshPromise: Promise<RelayApiRow[]> | null = null;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function relayTestCacheHeaders(): Record<string, string> {
  const ttlSeconds = Math.max(1, Math.floor(RESPONSE_TTL_MS / 1000));
  return {
    "Cache-Control": `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=60`,
  };
}

async function computeRelayApiRows(): Promise<RelayApiRow[]> {
  const coverageByServiceId = await getCoverageByServiceId();
  const chains = (servicesJson.services as Chain[]).filter((chain) =>
    coverageByServiceId.has(chain.serviceId),
  );

  return mapWithConcurrency(chains, CHAIN_TEST_CONCURRENCY, async (chain) => {
    const result = await performRelayTestForChain(
      chain,
      coverageByServiceId.get(chain.serviceId) || [],
    );

    return {
      label: chain.label,
      serviceId: chain.serviceId,
      chain: chain.name,
      type: chain.type,
      ...result,
      blockNumber: result.blockNumber?.toString(),
    };
  });
}

export async function refreshRelayApiRows(): Promise<RelayApiRow[]> {
  if (!relayResponseRefreshPromise) {
    relayResponseRefreshPromise = computeRelayApiRows()
      .then((result) => {
        relayResponseCache = {
          result,
          expiresAt: Date.now() + RESPONSE_TTL_MS,
        };
        return result;
      })
      .finally(() => {
        relayResponseRefreshPromise = null;
      });
  }

  return relayResponseRefreshPromise;
}

export function getRelayApiRowsSnapshot(): RelayApiRow[] | null {
  return relayResponseCache?.result || null;
}

export async function getRelayApiRowsCached(): Promise<RelayApiRow[]> {
  const now = Date.now();
  if (relayResponseCache && now < relayResponseCache.expiresAt) {
    return relayResponseCache.result;
  }

  if (relayResponseCache) {
    void refreshRelayApiRows().catch((error) => {
      console.warn(
        "[relay-test] Failed to refresh response cache; serving stale data:",
        (error as Error).message,
      );
    });
    return relayResponseCache.result;
  }

  return refreshRelayApiRows();
}
