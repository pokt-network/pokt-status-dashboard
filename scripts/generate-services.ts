import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { StargateClient } from "@cosmjs/stargate";
import { createPublicClient, http } from "viem";
import { Connection } from "@solana/web3.js";
import { SuiJsonRpcClient, JsonRpcHTTPTransport } from "@mysten/sui/jsonRpc";
import { TronWeb } from "tronweb";
import { connect, keyStores } from "near-api-js";
import { parseRpcEndpoints, RpcEndpoint } from "@/utils/rpc-endpoints-shared";

loadEnvConfig(process.cwd());

type ChainType = "evm" | "svm" | "cosmos" | "sui" | "tron" | "near" | "unknown";

interface ServiceFromPocket {
  id: string;
  name: string;
}

interface GeneratedService {
  label: string;
  name: string;
  serviceId: string;
  type: ChainType;
}

interface GeneratedOutput {
  services: GeneratedService[];
}

// ---- Env helpers -------------------------------------------------------

const POKT_API_URL = process.env.NEXT_PUBLIC_POCKET_API_URL;
const OUTPUT_PATH = path.resolve(process.cwd(), "src/data/services.json");

let RPC_ENDPOINTS: RpcEndpoint[];
try {
  RPC_ENDPOINTS = parseRpcEndpoints(process.env.RPC_ENDPOINTS_JSON);
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}

if (!POKT_API_URL) {
  console.error("NEXT_PUBLIC_POCKET_API_URL is not set");
  process.exit(1);
}

// ---- Small helpers -----------------------------------------------------

async function readExistingOutput(): Promise<GeneratedOutput> {
  if (!existsSync(OUTPUT_PATH)) {
    return { services: [] };
  }

  const raw = await fs.readFile(OUTPUT_PATH, "utf8");
  try {
    return JSON.parse(raw) as GeneratedOutput;
  } catch {
    console.warn("Existing services.json is invalid; starting fresh");
    return { services: [] };
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("Timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      },
    );
  });
}

async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = 5_000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

const commonHeaders = (serviceId: string, rpcKey: string) => ({
  Authorization: rpcKey,
  "Target-Service-Id": serviceId,
});

// ---- RPC sniffers ------------------------------------------------------

async function tryEvm(endpoint: RpcEndpoint, serviceId: string) {
  const client = createPublicClient({
    transport: http(endpoint.rpcUrl, {
      fetchOptions: {
        headers: commonHeaders(serviceId, endpoint.apiKey),
      },
    }),
  });
  const height = await withTimeout(client.getBlockNumber(), 5_000);

  if (height && typeof height === "bigint") {
    return height.toString() as string;
  }
  throw new Error("Not EVM (no hex result)");
}

async function tryCosmos(endpoint: RpcEndpoint, serviceId: string) {
  const client = await StargateClient.connect({
    url: endpoint.rpcUrl,
    headers: commonHeaders(serviceId, endpoint.apiKey),
  });
  const height = await withTimeout(client.getHeight(), 5_000);

  if (height && typeof height === "number") {
    return height as number;
  }
  throw new Error("Not Cosmos (no latest_block_height)");
}

async function trySolana(endpoint: RpcEndpoint, serviceId: string) {
  const client = new Connection(endpoint.rpcUrl, {
    httpHeaders: commonHeaders(serviceId, endpoint.apiKey),
  });
  const height = await withTimeout(client.getSlot(), 5_000);

  if (typeof height === "number") {
    return height as number;
  }
  throw new Error("Not Solana (no numeric slot)");
}

async function trySui(endpoint: RpcEndpoint, serviceId: string) {
  const client = new SuiJsonRpcClient({
    transport: new JsonRpcHTTPTransport({
      url: endpoint.rpcUrl,
      rpc: {
        headers: commonHeaders(serviceId, endpoint.apiKey),
      },
    }),
  });
  const height = await withTimeout(
    client.getLatestCheckpointSequenceNumber(),
    5_000,
  );

  if (typeof height === "string") {
    return height as string;
  }
  throw new Error("Not Sui (no numeric checkpoint)");
}

async function tryTron(endpoint: RpcEndpoint, serviceId: string) {
  const client = new TronWeb({
    fullHost: endpoint.rpcUrl,
    headers: commonHeaders(serviceId, endpoint.apiKey),
  });
  const block = await withTimeout(client.trx.getCurrentBlock(), 5_000);

  if (block && typeof block.blockID === "string") {
    return block.blockID as string;
  }
  throw new Error("Not Tron (no blockID)");
}

async function tryNear(endpoint: RpcEndpoint, serviceId: string) {
  const config = {
    networkId: "mainnet",
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl: endpoint.rpcUrl,
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    headers: commonHeaders(serviceId, endpoint.apiKey),
  };
  const client = await connect(config);
  const status = await withTimeout(client.connection.provider.status(), 5_000);

  if (status && typeof status.sync_info.latest_block_height === "number") {
    return status.sync_info.latest_block_height as number;
  }
  throw new Error("Not Near (no latest_block_height)");
}

async function sniffServiceTypeOnEndpoint(
  serviceId: string,
  endpoint: RpcEndpoint,
): Promise<ChainType> {
  try {
    await tryEvm(endpoint, serviceId);
    return "evm";
  } catch {
    // ignore
  }

  try {
    await tryCosmos(endpoint, serviceId);
    return "cosmos";
  } catch {
    // ignore
  }

  try {
    await trySolana(endpoint, serviceId);
    return "svm";
  } catch {
    // ignore
  }

  try {
    await trySui(endpoint, serviceId);
    return "sui";
  } catch {
    // ignore
  }

  try {
    await tryTron(endpoint, serviceId);
    return "tron";
  } catch {
    // ignore
  }

  try {
    await tryNear(endpoint, serviceId);
    return "near";
  } catch {
    // ignore
  }

  return "unknown";
}

async function sniffServiceType(
  serviceId: string,
  candidateEndpoints: RpcEndpoint[],
): Promise<ChainType> {
  for (const endpoint of candidateEndpoints) {
    const type = await sniffServiceTypeOnEndpoint(serviceId, endpoint);
    if (type !== "unknown") {
      return type;
    }
  }

  return "unknown";
}

// ---- Pocket service discovery -----------------------------------------

async function fetchAllServices(): Promise<ServiceFromPocket[]> {
  const services: ServiceFromPocket[] = [];
  const seenKeys = new Set<string>();
  let nextKey: string | undefined;
  const servicesFetchTimeoutMs = 8_000;

  while (true) {
    const url = new URL("/pokt-network/poktroll/service/service", POKT_API_URL); // adjust if your path differs
    url.searchParams.set("pagination.limit", "500");
    if (nextKey) {
      url.searchParams.set("pagination.key", nextKey);
    }

    const res = await fetchWithTimeout(url, undefined, servicesFetchTimeoutMs);
    if (!res.ok) {
      throw new Error(`Failed to fetch services: HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      message?: string;
      service?: ServiceFromPocket[];
      pagination?: {
        next_key?: string;
      };
    };

    if (!Array.isArray(json.service)) {
      throw new Error(json.message || "Malformed Pocket service response");
    }

    services.push(...json.service);

    const newNextKey = json.pagination?.next_key;
    if (!newNextKey) {
      break;
    }

    if (seenKeys.has(newNextKey)) {
      throw new Error("Pagination loop detected while fetching services");
    }

    seenKeys.add(newNextKey);
    nextKey = newNextKey;
  }

  return services;
}

async function fetchConfiguredServiceIds(
  endpoint: RpcEndpoint,
): Promise<string[]> {
  try {
    const res = await fetchWithTimeout(endpoint.healthUrl, undefined, 5_000);
    if (!res.ok) {
      console.warn(
        `Health failed for '${endpoint.name}' (${endpoint.healthUrl}): HTTP ${res.status}`,
      );
      return [];
    }

    const json = (await res.json()) as { configuredServiceIDs?: string[] };
    return json.configuredServiceIDs || [];
  } catch (error) {
    console.warn(
      `Health failed for '${endpoint.name}' (${endpoint.healthUrl}):`,
      (error as Error).message,
    );
    return [];
  }
}

async function fetchCoverageByServiceId(): Promise<Map<string, RpcEndpoint[]>> {
  const results = await Promise.all(
    RPC_ENDPOINTS.map(async (endpoint) => {
      const serviceIds = await fetchConfiguredServiceIds(endpoint);
      return { endpoint, serviceIds };
    }),
  );

  const coverageByServiceId = new Map<string, RpcEndpoint[]>();

  for (const { endpoint, serviceIds } of results) {
    for (const serviceId of serviceIds) {
      const current = coverageByServiceId.get(serviceId) || [];
      current.push(endpoint);
      coverageByServiceId.set(serviceId, current);
    }
  }

  return coverageByServiceId;
}

// ---- Main --------------------------------------------------------------

async function main() {
  console.log("Reading existing services.json (if any)...");
  const existing = await readExistingOutput();

  const existingById = new Map<string, GeneratedService>();
  for (const svc of existing.services) {
    existingById.set(svc.serviceId, svc);
  }

  console.log("Fetching Pocket services...");
  const allServices = await fetchAllServices();

  console.log("Fetching gateway health across configured RPC endpoints...");
  const coverageByServiceId = await fetchCoverageByServiceId();

  const relevantServices = allServices.filter((s) =>
    coverageByServiceId.has(s.id),
  );

  console.log(
    `Found ${relevantServices.length} services configured across all healthy gateway endpoints.`,
  );

  const updatedServices: GeneratedService[] = [...existing.services];

  for (const svc of relevantServices) {
    if (existingById.has(svc.id)) {
      continue; // already generated and in JSON
    }

    console.log(`Sniffing type for service '${svc.id}' (${svc.name})...`);
    let type: ChainType = "unknown";
    try {
      const candidateEndpoints = coverageByServiceId.get(svc.id) || [];
      type = await sniffServiceType(svc.id, candidateEndpoints);
    } catch (err) {
      console.warn(`  Failed to sniff ${svc.id}:`, (err as Error).message);
    }

    if (type === "unknown") {
      console.warn(`  Could not classify ${svc.id}, skipping.`);
      continue;
    }

    const entry: GeneratedService = {
      label: svc.name,
      name: svc.id,
      serviceId: svc.id,
      type,
    };

    updatedServices.push(entry);
    existingById.set(svc.id, entry);
  }

  updatedServices.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );

  const output: GeneratedOutput = { services: updatedServices };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote ${updatedServices.length} entries to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
