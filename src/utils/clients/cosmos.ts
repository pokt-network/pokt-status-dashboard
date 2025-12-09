// Using @cosmjs/stargate
import { StargateClient } from "@cosmjs/stargate";
import { env } from "../env";
import { ServiceID } from "../types";

export function createCosmosClient(rpc: string, serviceId: ServiceID) {
  return StargateClient.connect({
    url: rpc,
    headers: {
      Authorization: env.rpcKey,
      "Target-Service-Id": serviceId,
    },
  });
}

// Get latest block height
export async function getLatestBlockNumber(client: StargateClient) {
  return await client.getHeight();
}
