// Using @cosmjs/stargate
import { StargateClient } from '@cosmjs/stargate';

export function createCosmosClient(rpc: string) {
  return StargateClient.connect(rpc);
}

// Get latest block height
export async function getLatestBlockNumber(client: StargateClient) {
  return (await client.getBlock()).id;
}