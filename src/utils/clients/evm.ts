import { createPublicClient, http, PublicClient } from "viem";

export function createEvmClient(rpc: string) {
  return createPublicClient({
    transport: http(rpc),
  })
}

export async function getLatestBlockNumber(client: PublicClient) {
  return await client.getBlockNumber()
}