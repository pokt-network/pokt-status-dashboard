// Using @cosmjs/stargate
import { StargateClient } from "@cosmjs/stargate";
import { ServiceID } from "../types";

export function createCosmosClient(rpc: string, serviceId: ServiceID, rpcKey: string) {
  return StargateClient.connect({
    url: rpc,
    headers: {
      Authorization: rpcKey,
      "Target-Service-Id": serviceId,
    },
  });
}

// Get latest block height
export async function getLatestBlockNumber(client: StargateClient) {
  return await client.getHeight();
}
