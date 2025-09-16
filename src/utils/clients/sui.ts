// Using @mysten/sui.js
import { SuiClient } from '@mysten/sui.js/client';

export function createSuiClient(rpc: string) {
  return new SuiClient({ 
    url: rpc 
  });
}

export async function getLatestBlockNumber(client: SuiClient) {
  return await client.getLatestCheckpointSequenceNumber();
}