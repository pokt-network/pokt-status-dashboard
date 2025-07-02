import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useGateways } from "@/hooks/useGateways"
import { PaginationControls } from "../pagination/pagination-controls";
import { useState } from "react";

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

  const [pageKeys, setPageKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <PaginationControls
        pageKeys={pageKeys}
        setPageKeys={setPageKeys}
        setNextPageKey={setNextPageKey}
        nextPageKey={data?.pagination?.next_key}
      />

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
                <TableCell>{toTruncatedPoktAddress(gw.address)}</TableCell>
                <TableCell>{gw.stake.amount} {gw.stake.denom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}