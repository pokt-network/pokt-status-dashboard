import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    pocketApiUrl: process.env.NEXT_PUBLIC_POCKET_API_URL,
    rpcBaseDomain: process.env.NEXT_PUBLIC_RPC_BASE_DOMAIN,
    rpcKey: process.env.NEXT_PUBLIC_RPC_KEY,
  },
};

export default nextConfig;
