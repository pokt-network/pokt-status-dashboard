import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useGateways } from "@/hooks/useGateways"
import { PaginationControls } from "../pagination/pagination-controls";
import { useState } from "react";
import { useGatewayParams } from "@/hooks/useGatewayParams";

export function GatewaysTable({
  params,
  setNextPageKey,
}: {
  params?: {
    paginationKey?: string;
    paginationOffset?: number;
    paginationLimit?: number;
    paginationCountTotal?: boolean;
    paginationReverse?: boolean;
    delegateeGatewayAddress?: string;
  },
  setNextPageKey?: (nextPageKey: string) => void
}) {
  const { data, isLoading, error } = useGateways(params);
  const { data: paramsData } = useGatewayParams();

  const [pageKeys, setPageKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
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
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading gateways.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Stake</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.gateways?.map((gw) => (
              <TableRow key={gw.address}>
                <TableCell className="text-blue-600 font-medium">{toTruncatedPoktAddress(gw.address)}</TableCell>
                <TableCell>{gw.stake.amount} {gw.stake.denom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}