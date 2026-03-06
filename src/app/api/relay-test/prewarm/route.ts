import { NextResponse } from "next/server";
import { refreshRelayApiRows } from "@/utils/relay-test-cache";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: "CRON_SECRET is not configured",
      },
      { status: 500 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const result = await refreshRelayApiRows();
    return NextResponse.json(
      {
        success: true,
        warmed: true,
        rows: result.length,
        refreshedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
