const {
  NEXT_PUBLIC_POCKET_API_URL,
  NEXT_PUBLIC_RPC_BASE_DOMAIN,
  NEXT_PUBLIC_RPC_KEY,
} = process.env;

export const env = {
  apiUrl: NEXT_PUBLIC_POCKET_API_URL || process.env.pocketApiUrl || "",
  rpcUrlDomain: NEXT_PUBLIC_RPC_BASE_DOMAIN || process.env.rpcBaseDomain || "",
  rpcKey: NEXT_PUBLIC_RPC_KEY || process.env.rpcKey || "",
};

if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_POCKET_API_URL is not set");
}

if (!env.rpcUrlDomain) {
  throw new Error("NEXT_PUBLIC_RPC_BASE_DOMAIN is not set");
}

if (!env.rpcKey) {
  throw new Error("NEXT_PUBLIC_RPC_KEY is not set");
}