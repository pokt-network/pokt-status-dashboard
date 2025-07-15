import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { performRelayTest, useRelayTest } from "@/hooks/useRelayTest";
import { useServices } from "@/hooks/useServices";
import { useEffect, useMemo, useState } from "react";

export function StatusTable() {
  const refreshInterval = 1 * 60;
  const [countdown, setCountdown] = useState(refreshInterval);
  const { data: serviceData } = useServices();
  const [error, setError] = useState<Error | null>(null);

  const [results, setResults] = useState<{serviceId: string, blockNumber: number, latency: number, status: string}[]>([]);

  const isLoading = useMemo(() => results.length === 0, [results]);

  async function getPerformanceResults() {
    setError(null);
    if (!serviceData) {
      setError(new Error("No services found"));
      return;
    }
    for (const service of serviceData.service) {
      try {
        const { blockNumber, latency } = await performRelayTest({serviceId: service.id});
        setResults(prevResults => prevResults.map(result => result.serviceId === service.id ? { ...result, blockNumber, latency } : result));
      } catch (error) {
        setError(error as Error);
      }
    }
  }

  useEffect(() => {
    if (serviceData) {
      setResults(serviceData.service.map((service) => ({
        serviceId: service.id,
        blockNumber: 0,
        latency: 0,
        status: "Loading..."
      })));
    }
  }, [serviceData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
      if (countdown === 0) {
        getPerformanceResults();
        setCountdown(refreshInterval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, getPerformanceResults]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Refresh in:</p>
            <p>{countdown}</p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading applications.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service ID</TableHead>
              <TableHead>Block Number</TableHead>
              <TableHead>Latency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((item) => (
              <TableRow key={item.serviceId}>
                <TableCell className="text-blue-600 font-medium">{item.serviceId}</TableCell>
                <TableCell>{item.blockNumber}</TableCell>
                <TableCell>{item.latency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}