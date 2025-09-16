import {TronWeb} from 'tronweb';

export function createTronClient(rpc: string) {
  return new TronWeb({
    fullHost: rpc
  });
}

export async function getLatestBlockNumber(client: TronWeb) {
  return (await client.trx.getCurrentBlock()).blockID;
}