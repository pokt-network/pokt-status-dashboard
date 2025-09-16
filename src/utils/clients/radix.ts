// Using @radixdlt/radix-engine-toolkit
import { RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createRadixClient(rpc: string) {
  return new RadixEngineToolkit();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getLatestBlockNumber(client: RadixEngineToolkit) {
  // return await client.getLatestBlockNumber();
  throw new Error("Not implemented");
}

// // Initialize connection to Radix network
// const networkId = 0x01; // Mainnet
// const endpoint = 'YOUR_GROVE_RADIX_ENDPOINT';

// // Query account information
// const accountAddress = 'account_rdx1...';
// const accountInfo = await fetch(`${endpoint}/state/entity/details`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     addresses: [accountAddress]
//   })
// });

// console.log('Account info:', await accountInfo.json());