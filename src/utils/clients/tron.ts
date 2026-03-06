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
  const block = await client.trx.getCurrentBlock();
  const blockHeight: unknown = block?.block_header?.raw_data?.number;

  if (typeof blockHeight === "number" && Number.isFinite(blockHeight)) {
    return blockHeight;
  }

  if (typeof blockHeight === "string" && blockHeight.trim().length > 0) {
    return blockHeight;
  }

  throw new Error("Tron block height is unavailable in current block response");
}
