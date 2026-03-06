// Using @solana/web3.js
import { Connection } from "@solana/web3.js";
import { ServiceID } from "../types";

export function createSolanaClient(rpc: string, serviceId: ServiceID, rpcKey: string) {
  return new Connection(rpc, {
    httpHeaders: { Authorization: rpcKey, "Target-Service-Id": serviceId },
  });
}

export async function getLatestBlockNumber(client: Connection) {
  return await client.getSlot();
}
