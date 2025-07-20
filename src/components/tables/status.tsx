import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useRelayTest } from "@/hooks/useRelayTest";
import { useSuppliers } from "@/hooks/useSuppliers";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function StatusTable() {
  const refreshInterval = 5 * 60;
  const [countdown, setCountdown] = useState(refreshInterval);

  const { data: relayTestData, refetch, isLoading: isLoadingRelayTest, isFetching: isFetchingRelayTest } = useRelayTest();
  const { data: supplierData } = useSuppliers({
    paginationLimit: 1000,
    paginationCountTotal: true,
  });

  const data = useMemo(() => {
    return relayTestData?.map((item) => {
      const supplier = supplierData?.supplier.reduce((acc, supplier) => acc + supplier.services.reduce((count, service) => count + (service.service_id === item.chain ? 1 : 0), 0), 0);
      return {
        ...item,
        supplier,
      };
    });
  }, [relayTestData, supplierData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
      if (countdown === 0) {
        refetch();
        setCountdown(refreshInterval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, refetch]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end items-end mb-2 gap-2">
        {isLoadingRelayTest || isFetchingRelayTest ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-start gap-4">
              <p className="font-semibold">Refreshed in:</p>
              <p className="min-w-10 text-right">{countdown}s</p>
            </div>
          </div>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chain</TableHead>
            <TableHead># of Suppliers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Block</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? data.map((item) => (
            <TableRow key={item.chain}>
              <TableCell className="text-blue-600 font-medium">{item.chain}</TableCell>
              <TableCell>{item.supplier ?? "--"}</TableCell>
              <TableCell className={item.status === "success" ? "text-green-500" : item.status === "error" ? "text-red-500" : "text-yellow-500"}>{item.status === "success" ? "✅ Healthy" : item.status === "error" ? "❌ Need attention" : "⏳ Loading"}</TableCell>
              <TableCell>{item.latency ?? "--"}ms</TableCell>
              <TableCell>{item.blockNumber ?? "--"}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}