import { createPublicClient, http, PublicClient } from "viem";
import { env } from "../env";
import { ServiceID } from "../types";

export function createEvmClient(rpc: string, serviceId: ServiceID) {
  return createPublicClient({
    transport: http(rpc, {
      fetchOptions: {
        headers: { Authorization: env.rpcKey, "Target-Service-Id": serviceId },
      },
    }),
  });
}

export async function getLatestBlockNumber(client: PublicClient) {
  return await client.getBlockNumber();
}
