// Using near-api-js
import { connect, keyStores, Near } from "near-api-js";
import { ServiceID } from "../types";

export function createNearClient(rpc: string, serviceId: ServiceID, rpcKey: string) {
  const config = {
    networkId: "mainnet",
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl: rpc,
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    headers: { Authorization: rpcKey, "Target-Service-Id": serviceId },
  };
  return connect(config);
}

export async function getLatestBlockNumber(client: Near) {
  const status = await client.connection.provider.status();
  return status.sync_info.latest_block_height;
}
