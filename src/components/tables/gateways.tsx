import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useGateways } from "@/hooks/useGateways"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function GatewaysTable(params?: {
  paginationKey?: string;
  paginationOffset?: number;
  paginationLimit?: number;
  paginationCountTotal?: boolean;
  paginationReverse?: boolean;
  delegateeGatewayAddress?: string;
}) {
  const { data, isLoading, error } = useGateways(params);

  return (
    <>
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
            {data?.gateways?.map((gw: any) => (
              <TableRow key={gw.address}>
                <TableCell>{toTruncatedPoktAddress(gw.address)}</TableCell>
                <TableCell>{gw.stake.amount} {gw.stake.denom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}