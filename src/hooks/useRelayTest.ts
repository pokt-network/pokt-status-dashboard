import { useQuery } from "@tanstack/react-query";

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
