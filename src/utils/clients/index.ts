import { ChainType } from "../types";
import { createEvmClient, getLatestBlockNumber as getLatestBlockNumberEvm } from "./evm";
import { createRadixClient, getLatestBlockNumber as getLatestBlockNumberRadix } from "./radix";
import { createSolanaClient, getLatestBlockNumber as getLatestBlockNumberSvm } from "./svm";
import { createCosmosClient, getLatestBlockNumber as getLatestBlockNumberCosmos } from "./cosmos";
import { createNearClient, getLatestBlockNumber as getLatestBlockNumberNear } from "./near";
import { createSuiClient, getLatestBlockNumber as getLatestBlockNumberSui } from "./sui";
import { createTronClient, getLatestBlockNumber as getLatestBlockNumberTron } from "./tron";

export function createClient(rpc: string, type: ChainType) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLatestBlockNumber(client: any, type: ChainType) {
  switch (type) {
    case "evm":
      return await getLatestBlockNumberEvm(client);
    case "svm":
      return await getLatestBlockNumberSvm(client);
    case "radix":
      return await getLatestBlockNumberRadix(client);
    case "cosmos":
      return await getLatestBlockNumberCosmos(client);
    case "near":
      return await getLatestBlockNumberNear(client);
    case "sui":
      return await getLatestBlockNumberSui(client);
    case "tron":
      return await getLatestBlockNumberTron(client);
    default:
      throw new Error(`Unsupported chain type: ${type}`);
  }
}