// Using near-api-js
import { connect, keyStores, Near } from 'near-api-js';

export function createNearClient(rpc: string) {
  const config = {
    networkId: 'mainnet',
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: rpc,
    walletUrl: 'https://wallet.mainnet.near.org',
    helperUrl: 'https://helper.mainnet.near.org'
  };
  return connect(config);
}

export async function getLatestBlockNumber(client: Near) {
  return await client.connection.provider.getCurrentEpochSeatPrice();
}