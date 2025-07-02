import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";

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
        <div>Error loading suppliers.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operator Address</TableHead>
              <TableHead>Owner Address</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Unstake Session End Height</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.supplier?.map((sup: any) => (
              <TableRow key={sup.operator_address}>
                <TableCell>{toTruncatedPoktAddress(sup.operator_address)}</TableCell>
                <TableCell>{toTruncatedPoktAddress(sup.owner_address)}</TableCell>
                <TableCell>{sup.stake?.amount} {sup.stake?.denom}</TableCell>
                <TableCell>{sup.unstake_session_end_height}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}