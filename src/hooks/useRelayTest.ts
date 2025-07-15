import { useQuery } from "@tanstack/react-query";
import { env } from "@/utils/env";
import { useServices } from "./useServices";
import { ethers } from "ethers"


export async function performRelayTest({serviceId}: {serviceId: string}) {
  const POCKET_URL = `https://${serviceId}.${env.rpcUrlDomain}/${env.rpcKey}`
  const provider = new ethers.JsonRpcProvider(POCKET_URL)

  const startTime = performance.now();
  const blockNumber = await provider.getBlockNumber()
  const endTime = performance.now();
  const latency = endTime - startTime;

  return {
    blockNumber,
    latency: Math.round(latency), // latency in milliseconds
  };
}

export function useBlockNumber({serviceId}: {serviceId: string}) {
  return useQuery({
    queryKey: ["block-number", serviceId],
    queryFn: async () => {
      const POCKET_URL = `https://${serviceId}.${env.rpcUrlDomain}/${env.rpcKey}`
      const provider = new ethers.JsonRpcProvider(POCKET_URL)

      const startTime = performance.now();
      const blockNumber = await provider.getBlockNumber()
      const endTime = performance.now();
      const latency = endTime - startTime;

      return {
        blockNumber,
        latency: Math.round(latency), // latency in milliseconds
      };
    },
  });
}


export function useRelayTest() {
  const { data } = useServices()

  return useQuery({
    queryKey: ["relay-test"],
    queryFn: async () => {
      if (!data) return;
      const responses = await Promise.all(data?.service.map(async (service) => {
        const POCKET_URL = `https://${service.id}.${env.rpcUrlDomain}/${env.rpcKey}`
        const provider = new ethers.JsonRpcProvider(POCKET_URL)

        const startTime = performance.now();
        const blockNumber = await provider.getBlockNumber()
        const endTime = performance.now();
        const latency = endTime - startTime;

        return {
          serviceId: service.id,
          blockNumber,
          latency: Math.round(latency), // latency in milliseconds
        };
      }));
      return responses;
    },
  });
}