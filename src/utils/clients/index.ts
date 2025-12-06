import { ChainType } from "../types";
import { createEvmClient } from "./evm";
import { createRadixClient } from "./radix";
import { createSolanaClient } from "./svm";
import { createCosmosClient } from "./cosmos";
import { createNearClient } from "./near";
import { createSuiClient } from "./sui";
import { createTronClient } from "./tron";
import { env } from "../env";

export async function createClient(rpc: string, type: ChainType) {
  switch (type) {
    case "evm":
      return createEvmClient(rpc);
    case "svm":
      return createSolanaClient(rpc);
    case "radix":
      return createRadixClient(rpc);
    case "cosmos":
      return createCosmosClient(rpc);
    case "near":
      return createNearClient(rpc);
    case "sui":
      return createSuiClient(rpc);
    case "tron":
      return createTronClient(rpc);
    default:
      throw new Error(`Unsupported chain type: ${type}`);
  }
}

export async function getLatestBlockNumber(
  gatewayUrl: string,
  serviceId: string
) {
  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Target-Service-Id": serviceId,
      Authorization: env.rpcKey,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_blockNumber",
      params: [],
    }),
  });

  const data = await response.json();
  if (data.result) {
    return BigInt(data.result);
  } else {
    throw new Error("Failed to fetch block number");
  }
}
