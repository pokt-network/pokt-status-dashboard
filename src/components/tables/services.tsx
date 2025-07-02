import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useServices } from "@/hooks/useServices";
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";

export function ServicesTable({
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
  const { data, isLoading, error } = useServices(params);

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
    </div>
  );
}