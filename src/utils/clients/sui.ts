// Using @mysten/sui.js
import { SuiJsonRpcClient, JsonRpcHTTPTransport } from "@mysten/sui/jsonRpc";
import { ServiceID } from "../types";
import { env } from "../env";

export function createSuiClient(rpc: string, serviceId: ServiceID) {
  return new SuiJsonRpcClient({
    transport: new JsonRpcHTTPTransport({
      url: rpc,
      rpc: {
        headers: {
          Authorization: env.rpcKey,
          "Target-Service-Id": serviceId,
        },
      },
    }),
  });
}

export async function getLatestBlockNumber(client: SuiJsonRpcClient) {
  return await client.getLatestCheckpointSequenceNumber();
}
