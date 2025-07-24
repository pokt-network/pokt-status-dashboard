import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useRelayTest } from "@/hooks/useRelayTest";
import { useSuppliers } from "@/hooks/useSuppliers";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
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
      <div className="flex justify-end items-end mb-2 gap-2 mr-2">
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
              <TableCell>{item.chain}</TableCell>
              <TableCell>{item.supplier ?? "--"}</TableCell>
              <TableCell>
                <HealthLabel status={item.status} />
              </TableCell>
              <TableCell>{item.latency ?? "--"}ms</TableCell>
              <TableCell>{item.blockNumber ?? "--"}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function HealthLabel({ status }: { status: string }) {
  return (
    <div className={cn(status === "success" ? "text-[#60BC29]" : status === "error" ? "text-[#E03834]" : "text-yellow-500")}>
      {status === "success" ? (
        <div className="flex items-center gap-2">
          <CircleCheck className="w-4 h-4" />
          <p>Healthy</p>
        </div>
      ) : status === "error" ? (
        <div className="flex items-center gap-2">
          <CircleX className="w-4 h-4" />
          <p>Needs attention</p>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p>Loading</p>
        </div>
      )}
    </div>
  );
}