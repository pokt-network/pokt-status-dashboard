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
import { useServices } from "@/hooks/useServices";

export function ServicesTable(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const { data, isLoading, error } = useServices(params);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading services.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Compute Units/Relay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.service?.map((svc: any) => (
              <TableRow key={svc.id}>
                <TableCell>{svc.id}</TableCell>
                <TableCell>{svc.name}</TableCell>
                <TableCell>{toTruncatedPoktAddress(svc.owner_address)}</TableCell>
                <TableCell>{svc.compute_units_per_relay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}