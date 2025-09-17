import { useQuery } from "@tanstack/react-query";
import { env } from "@/utils/env";
import { Chain } from "@/utils/types";
import { createPublicClient, http } from "viem";
import { createClient, getLatestBlockNumber } from "@/utils/clients";

export async function performRelayTest({name, type}: Chain) {
  const POCKET_URL = `https://${name}.${env.rpcUrlDomain}/${env.rpcKey}`
  
  let blockNumber: bigint | null = null;
  let status: "success" | "error" = "success";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;
  
  try {
    client = await createClient(POCKET_URL, type)
  } catch (error) {
    console.error(error);
    blockNumber = null;
    status = "error";
  }

  if (!client) {
    return {
      blockNumber: null,
      status: "error",
      latency: 0,
    };
  }

  const startTime = performance.now();
  try {
    const result = await getLatestBlockNumber(client)
    blockNumber = BigInt(result ?? 0)
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