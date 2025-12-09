import { TronWeb } from "tronweb";
import { ServiceID } from "../types";
import { env } from "../env";

export function createTronClient(rpc: string, serviceId: ServiceID) {
  return new TronWeb({
    fullHost: rpc,
    headers: {
      Authorization: env.rpcKey,
      "Target-Service-Id": serviceId,
    },
  });
}

export async function getLatestBlockNumber(client: TronWeb) {
  return (await client.trx.getCurrentBlock()).blockID;
}
