import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useRelayTest } from "@/hooks/useRelayTest";
import { useSuppliers } from "@/hooks/useSuppliers";
import { cn } from "@/lib/utils";
import { ChainName, ServiceID } from "@/utils/types";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

export function StatusTable() {
  const { data: relayTestData } = useRelayTest();
  const { data: supplierData } = useSuppliers({
    paginationLimit: 1000,
    paginationCountTotal: true,
  });

  function matchServiceIdAndChain(serviceId: ServiceID, chain: ChainName) {
    if (serviceId === chain) return true;
    if (serviceId === "arb-one" && chain === "arbitrum-one") return true;
    if (serviceId === "arb-sepolia-testnet" && chain === "arbitrum-sepolia-testnet") return true;
    if (serviceId === "base-sepolia-testnet" && chain === "base-testnet") return true;
    if (serviceId === "bera" && chain === "berachain") return true;
    if (serviceId === "avax-dfk" && chain === "defi-kingdoms") return true;
    if (serviceId === "evmos" && chain === "evm") return true;
    if (serviceId === "op" && chain === "optimism") return true;
    if (serviceId === "op-sepolia-testnet" && chain === "optimism-sepolia-testnet") return true;
    if (serviceId === "poly-amoy-testnet" && chain === "polygon-amoy-testnet") return true;
    if (serviceId === "poly-zkevm" && chain === "polygon-zkevm") return true;
    if (serviceId === "poly" && chain === "polygon") return true;
    if (serviceId === "xrplevm-testnet" && chain === "xrpl-evm-testnet") return true;
    
    return false;
  }

  const serviceIds = useMemo(() => {
    const serviceIds = supplierData?.supplier.map(
      (supplier) => supplier.services.map(
        (service) => service.service_id
      )
    ).flat().filter((serviceId) => serviceId !== undefined);
    return [...new Set(serviceIds)];
  }, [supplierData]);

  useEffect(() => {
    console.log(serviceIds);
  }, [serviceIds]);

  const data = useMemo(() => {
    return relayTestData?.map((item) => {
      const supplier = supplierData?.supplier.reduce(
        (acc, supplier) => {
          return acc + supplier.services.reduce(
            (count, service) => {
              return count + (matchServiceIdAndChain(service.service_id, item.chain as ChainName) ? 1 : 0)
            },
            0
          )
        }, 0);
      return {
        ...item,
        supplier,
      };
    });
  }, [relayTestData, supplierData]);

  return (
    <div className="flex flex-col gap-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chain</TableHead>
            <TableHead className="text-center">Supplier Count</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Latency</TableHead>
            <TableHead className="text-center">Block</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? data.map((item) => (
            <TableRow key={item.chain}>
              <TableCell>{item.chain}</TableCell>
              <TableCell className="text-center">{item.supplier ?? "--"}</TableCell>
              <TableCell className="text-center">
                <HealthLabel status={item.status} />
              </TableCell>
              <TableCell className="text-center">{item.latency ?? "--"}ms</TableCell>
              <TableCell className="text-center">{item.blockNumber ?? "--"}</TableCell>
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
    <div className={cn("flex justify-center", status === "success" ? "text-[#60BC29]" : status === "error" ? "text-[#E03834]" : "text-yellow-500")}>
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