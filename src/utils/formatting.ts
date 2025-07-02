export function toTruncatedPoktAddress(address: string, prefixLength: number = 6, suffixLength: number = 4) {
  const poktPrefix = "pokt";
  return `${address.slice(0, poktPrefix.length + prefixLength)}...${address.slice(-suffixLength - poktPrefix.length)}`;
}