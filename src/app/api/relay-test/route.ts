import { NextResponse } from "next/server";
import servicesJson from "@/data/services.json";
import {
  getCoverageByServiceId,
  performRelayTestForChain,
} from "@/utils/relay-test";
import { Chain } from "@/utils/types";

export async function GET() {
  try {
    const coverageByServiceId = await getCoverageByServiceId();
    const chains = (servicesJson.services as Chain[]).filter((chain) =>
      coverageByServiceId.has(chain.serviceId),
    );

    const responses = await Promise.all(
      chains.map(async (chain) => {
        const result = await performRelayTestForChain(
          chain,
          coverageByServiceId.get(chain.serviceId) || [],
        );
        return {
          label: chain.label,
          serviceId: chain.serviceId,
          chain: chain.name,
          type: chain.type,
          ...result,
          blockNumber: result.blockNumber?.toString(),
        };
      }),
    );
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
