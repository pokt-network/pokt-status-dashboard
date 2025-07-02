import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSuppliers } from "@/hooks/useSuppliers";

export function SuppliersTable(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const { data, isLoading, error } = useSuppliers(params);

  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2">Services</h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{data?.pagination?.total}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{data?.pagination?.next_key}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
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
    </>
  );
}