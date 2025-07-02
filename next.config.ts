import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    pocketApiUrl: process.env.NEXT_PUBLIC_POCKET_API_URL,
  },
};

export default nextConfig;
