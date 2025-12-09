// Using @solana/web3.js
import { Connection } from "@solana/web3.js";
import { env } from "../env";
import { ServiceID } from "../types";

export function createSolanaClient(rpc: string, serviceId: ServiceID) {
  return new Connection(rpc, {
    httpHeaders: { Authorization: env.rpcKey, "Target-Service-Id": serviceId },
  });
}

export async function getLatestBlockNumber(client: Connection) {
  return await client.getSlot();
}
