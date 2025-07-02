import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useApplications } from "@/hooks/useApplications"
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";

export function ApplicationsTable({params, setNextPageKey}: {
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
  const { data, isLoading, error } = useApplications(params);
  
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
        <div>Error loading applications.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Delegatee Gateways</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.applications.map((app) => (
              <TableRow key={app.address}>
                <TableCell>{toTruncatedPoktAddress(app.address)}</TableCell>
                <TableCell>{app.stake.amount} {app.stake.denom}</TableCell>
                <TableCell>{app.delegatee_gateway_addresses?.map((addr: string) => toTruncatedPoktAddress(addr)).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}