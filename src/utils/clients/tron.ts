import { TronWeb } from "tronweb";
import { ServiceID } from "../types";

export function createTronClient(rpc: string, serviceId: ServiceID, rpcKey: string) {
  return new TronWeb({
    fullHost: rpc,
    headers: {
      Authorization: rpcKey,
      "Target-Service-Id": serviceId,
    },
  });
}

export async function getLatestBlockNumber(client: TronWeb) {
  return (await client.trx.getCurrentBlock()).blockID;
}
