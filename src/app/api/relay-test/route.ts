import { NextResponse } from "next/server";
import { performRelayTest } from "@/hooks/useRelayTest";
import { RPC_URLS } from "@/utils/rpc";

export async function GET() {
  try {
    const responses = await Promise.all(RPC_URLS.map(async (chain) => {
      const result = await performRelayTest({chain: chain});
      return {
        chain,
        ...result,
        blockNumber: result.blockNumber?.toString(),
      };
    }));
    return NextResponse.json({
      success: true,
      result: responses,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}