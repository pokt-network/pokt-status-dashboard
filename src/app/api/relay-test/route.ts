import { NextResponse } from "next/server";
import { performRelayTest } from "@/hooks/useRelayTest";
import { RPC_URLS } from "@/utils/rpc";

export async function GET() {
  try {
    const responses = await Promise.all(RPC_URLS.map(async (chain) => {
      const result = await performRelayTest(chain);
      return {
        label: chain.label,
        serviceId: chain.serviceId,
        chain: chain.name,
        type: chain.type,
        ...result,
        blockNumber: result.blockNumber?.toString(),
      };
    }));
    return NextResponse.json({
      success: true,
      result: responses,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Unknown error",
    });
  }
}