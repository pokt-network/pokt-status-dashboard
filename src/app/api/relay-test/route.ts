import { NextResponse } from "next/server";
import { performRelayTest } from "@/hooks/useRelayTest";
import { PocketApi } from "@/utils/api";
import { env } from "@/utils/env";

export async function GET() {
  try {
    const api = new PocketApi(env.apiUrl);
    const res = await api.poktNetwork.poktroll.service.service();
    if (!("service" in res)) {
      throw new Error(res.message || "Failed to fetch services");
    }
    const { service } = res;

    const GATEWAY_HEALTH_URL = `https://${env.rpcUrlDomain}/healthz`;
    const gatewayHealth = await fetch(GATEWAY_HEALTH_URL).then((res) =>
      res.json()
    );
    const configuredServiceIDs: string[] =
      gatewayHealth.configuredServiceIDs || [];

    // Filter services to only include those that are configured in the gateway
    const allServices = service.filter((service) =>
      configuredServiceIDs.includes(service.id)
    );

    const responses = await Promise.all(
      allServices.map(async (service) => {
        const result = await performRelayTest(service);
        return {
          label: service.name,
          serviceId: service.id,
          chain: service.name,
          ...result,
          blockNumber: result.blockNumber?.toString(),
        };
      })
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
