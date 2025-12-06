import { useQuery } from "@tanstack/react-query";
import { env } from "@/utils/env";
import { getLatestBlockNumber } from "@/utils/clients";

export async function performRelayTest({ id: serviceId }: { id: string }) {
  const GATEWAY_URL = `https://${env.rpcUrlDomain}/v1`;

  let blockNumber: bigint | null = null;
  let status: "success" | "error" = "success";

  const startTime = performance.now();
  try {
    const result = await getLatestBlockNumber(GATEWAY_URL, serviceId);
    blockNumber = BigInt(result ?? 0);
  } catch (error) {
    console.error(error);
    blockNumber = null;
    status = "error";
  }
  const endTime = performance.now();
  const latency = endTime - startTime;

  return {
    blockNumber,
    status,
    latency: Math.round(latency), // latency in milliseconds
  };
}

export function useBlockNumber({ serviceId }: { serviceId: string }) {
  return useQuery({
    queryKey: ["block-number", serviceId],
    queryFn: async () => {
      const GATEWAY_URL = `https://${env.rpcUrlDomain}/v1`;

      let blockNumber: bigint | null = null;
      let status: "success" | "error" = "success";
      const startTime = performance.now();
      try {
        const result = await getLatestBlockNumber(GATEWAY_URL, serviceId);
        blockNumber = BigInt(result ?? 0);
      } catch (error) {
        console.error(error);
        blockNumber = null;
        status = "error";
      }
      const endTime = performance.now();
      const latency = endTime - startTime;

      return {
        blockNumber,
        status,
        latency: Math.round(latency), // latency in milliseconds
      };
    },
  });
}

export function useRelayTest() {
  return useQuery({
    queryKey: ["relay-test"],
    queryFn: async () => {
      const responses = await fetch("/api/relay-test");
      if (!responses.ok) {
        throw new Error("Failed to fetch relay test");
      }
      const data = await responses.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch relay test");
      }
      return data.result as {
        label: string;
        serviceId: string;
        chain: string;
        type: string;
        blockNumber: string;
        status: "success" | "error";
        latency: number;
      }[];
    },
  });
}
