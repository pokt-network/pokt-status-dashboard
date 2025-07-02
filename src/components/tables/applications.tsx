import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useApplications } from "@/hooks/useApplications"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useMemo, useState } from "react";

export function ApplicationsTable(params?: {
  paginationKey?: string;
  paginationOffset?: number;
  paginationLimit?: number;
  paginationCountTotal?: boolean;
  paginationReverse?: boolean;
  delegateeGatewayAddress?: string;
}) {
  const [prevPageKey, setPrevPageKey] = useState<string | undefined>(undefined);
  const [currentPageKey, setCurrentPageKey] = useState<string | undefined>(params?.paginationKey);
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);
  const { data: applications, isLoading: applicationsLoading, error: applicationsError } = useApplications(params);

  return (
    <>
      {applicationsLoading ? (
        <div>Loading...</div>
      ) : applicationsError ? (
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
            {applications?.applications.map((app: any) => (
              <TableRow key={app.address}>
                <TableCell>{toTruncatedPoktAddress(app.address)}</TableCell>
                <TableCell>{app.stake.amount} {app.stake.denom}</TableCell>
                <TableCell>{app.delegatee_gateway_addresses?.map((addr: string) => toTruncatedPoktAddress(addr)).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}