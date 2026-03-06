import { ChainType, ServiceID } from "../types";
import {
  createEvmClient,
  getLatestBlockNumber as getLatestBlockNumberEvm,
} from "./evm";
import {
  createRadixClient,
  getLatestBlockNumber as getLatestBlockNumberRadix,
} from "./radix";
import {
  createSolanaClient,
  getLatestBlockNumber as getLatestBlockNumberSvm,
} from "./svm";
import {
  createCosmosClient,
  getLatestBlockNumber as getLatestBlockNumberCosmos,
} from "./cosmos";
import {
  createNearClient,
  getLatestBlockNumber as getLatestBlockNumberNear,
} from "./near";
import {
  createSuiClient,
  getLatestBlockNumber as getLatestBlockNumberSui,
} from "./sui";
import {
  createTronClient,
  getLatestBlockNumber as getLatestBlockNumberTron,
} from "./tron";
import { PublicClient } from "viem";
import { Near } from "near-api-js";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { TronWeb } from "tronweb";
import { StargateClient } from "@cosmjs/stargate";
import { Connection } from "@solana/web3.js";
import { RadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";

export async function createClient(
  rpc: string,
  type: ChainType,
  serviceId: ServiceID,
  rpcKey: string,
) {
  switch (type) {
    case "evm":
      return createEvmClient(rpc, serviceId, rpcKey);
    case "svm":
      return createSolanaClient(rpc, serviceId, rpcKey);
    case "radix":
      return createRadixClient(rpc);
    case "cosmos":
      return createCosmosClient(rpc, serviceId, rpcKey);
    case "near":
      return createNearClient(rpc, serviceId, rpcKey);
    case "sui":
      return createSuiClient(rpc, serviceId, rpcKey);
    case "tron":
      return createTronClient(rpc, serviceId, rpcKey);
    default:
      throw new Error(`Unsupported chain type: ${type}`);
  }
}

export async function getLatestBlockNumber(
  client:
    | PublicClient
    | StargateClient
    | Near
    | SuiJsonRpcClient
    | TronWeb
    | RadixEngineToolkit
    | Connection,
) {
  if (client instanceof StargateClient) {
    return await getLatestBlockNumberCosmos(client);
  }
  if (client instanceof Near) {
    return await getLatestBlockNumberNear(client);
  }
  if (client instanceof SuiJsonRpcClient) {
    return await getLatestBlockNumberSui(client);
  }
  if (client instanceof TronWeb) {
    return await getLatestBlockNumberTron(client);
  }
  if (client instanceof RadixEngineToolkit) {
    return await getLatestBlockNumberRadix(client);
  }
  if (client instanceof Connection) {
    return await getLatestBlockNumberSvm(client);
  }
  return await getLatestBlockNumberEvm(client);
}
