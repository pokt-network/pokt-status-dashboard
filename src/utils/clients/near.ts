// Using near-api-js
import { connect, keyStores, Near } from "near-api-js";
import { env } from "../env";
import { ServiceID } from "../types";

export function createNearClient(rpc: string, serviceId: ServiceID) {
  const config = {
    networkId: "mainnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: rpc,
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    headers: { Authorization: env.rpcKey, "Target-Service-Id": serviceId },
  };
  return connect(config);
}

export async function getLatestBlockNumber(client: Near) {
  return await client.connection.provider.getCurrentEpochSeatPrice();
}
