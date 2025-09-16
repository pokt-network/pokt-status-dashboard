// Using @solana/web3.js
import { Connection } from '@solana/web3.js';

export function createSolanaClient(rpc: string) {
  return new Connection(rpc, 'confirmed');
}

export async function getLatestBlockNumber(client: Connection) {
  return await client.getSlot();
}