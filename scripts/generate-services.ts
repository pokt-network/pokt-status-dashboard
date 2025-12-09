import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { StargateClient } from "@cosmjs/stargate";
import { createPublicClient, http } from "viem";
import { Connection } from "@solana/web3.js";
import { SuiJsonRpcClient, JsonRpcHTTPTransport } from "@mysten/sui/jsonRpc";
import { TronWeb } from "tronweb";
import { connect, keyStores } from "near-api-js";

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
const GATEWAY_DOMAIN = process.env.NEXT_PUBLIC_RPC_BASE_DOMAIN;
const GATEWAY_RPC_URL = `https://${GATEWAY_DOMAIN}/v1`;
const GATEWAY_RPC_KEY = process.env.NEXT_PUBLIC_RPC_KEY;

if (!POKT_API_URL || !GATEWAY_DOMAIN || !GATEWAY_RPC_URL || !GATEWAY_RPC_KEY) {
  console.error(
    "Missing one of NEXT_PUBLIC_POCKET_API_URL, NEXT_PUBLIC_RPC_BASE_DOMAIN, NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_RPC_KEY"
  );
  process.exit(1);
}

const OUTPUT_PATH = path.resolve(process.cwd(), "src/data/services.json");

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
      }
    );
  });
}

// ---- RPC sniffers ------------------------------------------------------

const commonHeaders = (serviceId: string) => ({
  Authorization: GATEWAY_RPC_KEY!,
  "Target-Service-Id": serviceId,
});

async function tryEvm(rpcUrl: string, serviceId: string) {
  const client = createPublicClient({
    transport: http(rpcUrl, {
      fetchOptions: {
        headers: commonHeaders(serviceId),
      },
    }),
  });
  const height = await withTimeout(client.getBlockNumber(), 5_000);

  if (height && typeof height === "bigint") {
    return height.toString() as string;
  }
  throw new Error("Not EVM (no hex result)");
}

async function tryCosmos(rpcUrl: string, serviceId: string) {
  const client = await StargateClient.connect({
    url: rpcUrl,
    headers: commonHeaders(serviceId),
  });
  const height = await withTimeout(client.getHeight(), 5_000);

  if (height && typeof height === "number") {
    return height as number;
  }
  throw new Error("Not Cosmos (no latest_block_height)");
}

async function trySolana(rpcUrl: string, serviceId: string) {
  const client = new Connection(rpcUrl, {
    httpHeaders: commonHeaders(serviceId),
  });
  const height = await withTimeout(client.getSlot(), 5_000);

  if (typeof height === "number") {
    return height as number;
  }
  throw new Error("Not Solana (no numeric slot)");
}

async function trySui(rpcUrl: string, serviceId: string) {
  const client = new SuiJsonRpcClient({
    transport: new JsonRpcHTTPTransport({
      url: rpcUrl,
      rpc: {
        headers: commonHeaders(serviceId),
      },
    }),
  });
  const height = await withTimeout(
    client.getLatestCheckpointSequenceNumber(),
    5_000
  );

  if (typeof height === "string") {
    return height as string;
  }
  throw new Error("Not Sui (no numeric checkpoint)");
}

async function tryTron(rpcUrl: string, serviceId: string) {
  const client = new TronWeb({
    fullHost: rpcUrl,
    headers: commonHeaders(serviceId),
  });
  const block = await withTimeout(client.trx.getCurrentBlock(), 5_000);

  if (block && typeof block.blockID === "string") {
    return block.blockID as string;
  }
  throw new Error("Not Tron (no blockID)");
}

async function tryNear(rpcUrl: string, serviceId: string) {
  const config = {
    networkId: "mainnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: rpcUrl,
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    headers: commonHeaders(serviceId),
  };
  const client = await connect(config);
  const status = await withTimeout(client.connection.provider.status(), 5_000);

  if (status && typeof status.sync_info.latest_block_height === "number") {
    return status.sync_info.latest_block_height as number;
  }
  throw new Error("Not Near (no latest_block_height)");
}

async function sniffServiceType(serviceId: string): Promise<ChainType> {
  // 1. Try EVM
  try {
    await tryEvm(GATEWAY_RPC_URL!, serviceId);
    return "evm";
  } catch {
    // ignore
  }

  // 2. Try Cosmos
  try {
    await tryCosmos(GATEWAY_RPC_URL!, serviceId);
    return "cosmos";
  } catch {
    // ignore
  }

  // 3. Try Solana
  try {
    await trySolana(GATEWAY_RPC_URL!, serviceId);
    return "svm";
  } catch {
    // ignore
  }

  // 4. Try Sui
  try {
    await trySui(GATEWAY_RPC_URL!, serviceId);
    return "sui";
  } catch {
    // ignore
  }

  // 5. Try Tron
  try {
    await tryTron(GATEWAY_RPC_URL!, serviceId);
    return "tron";
  } catch {
    // ignore
  }

  // 6. Try Near
  try {
    await tryNear(GATEWAY_RPC_URL!, serviceId);
    return "near";
  } catch {
    // ignore
  }

  return "unknown";
}

// ---- Pocket service discovery -----------------------------------------

async function fetchAllServices(): Promise<ServiceFromPocket[]> {
  const url = new URL("/pokt-network/poktroll/service/service", POKT_API_URL); // adjust if your path differs
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch services: HTTP ${res.status}`);
  }
  const json = await res.json();
  if (!("service" in json)) {
    throw new Error(json.message || "Malformed Pocket service response");
  }
  return json.service as ServiceFromPocket[];
}

async function fetchConfiguredServiceIds(): Promise<string[]> {
  const healthUrl = `https://${GATEWAY_DOMAIN}/healthz`;
  const res = await fetch(healthUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch gateway health: HTTP ${res.status}`);
  }
  const json = await res.json();
  return (json.configuredServiceIDs || []) as string[];
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

  console.log("Fetching gateway health...");
  const configuredIds = await fetchConfiguredServiceIds();

  const relevantServices = allServices.filter((s) =>
    configuredIds.includes(s.id)
  );

  console.log(
    `Found ${relevantServices.length} services configured in gateway.`
  );

  const updatedServices: GeneratedService[] = [...existing.services];

  for (const svc of relevantServices) {
    if (existingById.has(svc.id)) {
      continue; // already generated and in JSON
    }

    console.log(`Sniffing type for service '${svc.id}' (${svc.name})...`);
    let type: ChainType = "unknown";
    try {
      type = await sniffServiceType(svc.id);
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
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  );

  const output: GeneratedOutput = { services: updatedServices };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote ${updatedServices.length} entries to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
