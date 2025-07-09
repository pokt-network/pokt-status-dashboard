import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";
import { useSupplierParams } from "@/hooks/useSupplierParams";

export function SuppliersTable({
  params,
  setNextPageKey,
}: {
  params?: {
    paginationKey?: string;
    paginationOffset?: number;
    paginationLimit?: number;
    paginationCountTotal?: boolean;
    paginationReverse?: boolean;
  },
  setNextPageKey?: (nextPageKey: string) => void
}) {
  const [pageKeys, setPageKeys] = useState<string[]>([]);
  const { data, isLoading, error } = useSuppliers(params);
  const { data: paramsData } = useSupplierParams();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Staking Fee:</p>
            <p>{paramsData?.params?.staking_fee.amount} {paramsData?.params?.staking_fee.denom}</p>
          </div>
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Min Stake:</p>  
            <p>{paramsData?.params?.min_stake.amount} {paramsData?.params?.min_stake.denom}</p>
          </div>
        </div>
        <PaginationControls
          pageKeys={pageKeys}
          setPageKeys={setPageKeys}
          setNextPageKey={setNextPageKey}
          nextPageKey={data?.pagination?.next_key}
        />
      </div>
      {isLoading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">Error loading suppliers.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>No. of Services</TableHead>
              <TableHead>Services</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.supplier?.map((sup, index) => (
              <TableRow key={sup.operator_address}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-medium">{toTruncatedPoktAddress(sup.operator_address)}</span>
                    <span className="text-gray-500 text-sm">owned by: {toTruncatedPoktAddress(sup.owner_address)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{sup.stake?.amount} {sup.stake?.denom}</TableCell>
                <TableCell className="text-center">{sup.services.length}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {sup.services.map((service, serviceIndex) => (
                      <span key={serviceIndex} className="text-sm text-gray-600">
                        {service.service_id}
                        {serviceIndex < sup.services.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}