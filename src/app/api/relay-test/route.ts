import { NextResponse } from "next/server";
import {
  getRelayApiRowsCached,
  getRelayApiRowsSnapshot,
  relayTestCacheHeaders,
} from "@/utils/relay-test-cache";

export async function GET() {
  try {
    const responses = await getRelayApiRowsCached();
    return NextResponse.json(
      {
        success: true,
        result: responses,
      },
      { headers: relayTestCacheHeaders() },
    );
  } catch (error) {
    const cached = getRelayApiRowsSnapshot();
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          result: cached,
        },
        { headers: relayTestCacheHeaders() },
      );
    }

    return NextResponse.json({
      success: false,
      error: (error as Error).message || "Unknown error",
    });
  }
}
