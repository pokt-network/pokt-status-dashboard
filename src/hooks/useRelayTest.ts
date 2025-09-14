import { useQuery } from "@tanstack/react-query";
import { env } from "@/utils/env";
import { createPublicClient, http } from "viem";

export async function performRelayTest({chain}: {chain: string}) {
  const POCKET_URL = `https://${chain}.${env.rpcUrlDomain}/${env.rpcKey}`
  const client = createPublicClient({
    transport: http(POCKET_URL),
  })

  let blockNumber: bigint | null = null;
  let status: "success" | "error" = "success";
  const startTime = performance.now();
  try {
    blockNumber = await client.getBlockNumber()
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

export function useBlockNumber({serviceId}: {serviceId: string}) {
  return useQuery({
    queryKey: ["block-number", serviceId],
    queryFn: async () => {
      const POCKET_URL = `https://${serviceId}.${env.rpcUrlDomain}/${env.rpcKey}`
      const client = createPublicClient({
        transport: http(POCKET_URL),
      })

      let blockNumber: bigint | null = null;
      let status: "success" | "error" = "success";
      const startTime = performance.now();
      try {
        blockNumber = await client.getBlockNumber()
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
        chain: string;
        blockNumber: string;
        status: "success" | "error";
        latency: number;
      }[];
    },
  });
}