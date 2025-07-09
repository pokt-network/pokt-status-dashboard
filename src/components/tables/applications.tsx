import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useApplications } from "@/hooks/useApplications"
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";
import { useApplicationParams } from "@/hooks/useApplicationParams";

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
  const { data: paramsData } = useApplicationParams();
  
  const [pageKeys, setPageKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Max Delegated Gateways:</p>
            <p>{paramsData?.params?.max_delegated_gateways}</p>
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
                <TableCell className="text-blue-600 font-medium">{toTruncatedPoktAddress(app.address)}</TableCell>
                <TableCell>{app.stake.amount} {app.stake.denom}</TableCell>
                <TableCell className="text-blue-600 font-medium">{app.delegatee_gateway_addresses?.map((addr: string) => toTruncatedPoktAddress(addr)).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}