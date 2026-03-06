import { createPublicClient, http, PublicClient } from "viem";
import { ServiceID } from "../types";

export function createEvmClient(
  rpc: string,
  serviceId: ServiceID,
  rpcKey: string,
) {
  return createPublicClient({
    transport: http(rpc, {
      fetchOptions: {
        headers: { Authorization: rpcKey, "Target-Service-Id": serviceId },
      },
    }),
  });
}

export async function getLatestBlockNumber(client: PublicClient) {
  return await client.getBlockNumber();
}
