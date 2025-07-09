import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useServices } from "@/hooks/useServices";
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";
import { useServiceParams } from "@/hooks/useServiceParams";

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
  const { data: paramsData } = useServiceParams();

  const [pageKeys, setPageKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Target Number of Relays:</p>
            <p>{paramsData?.params?.target_num_relays}</p>
          </div>
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Add Service Fee:</p>
            <p>{paramsData?.params?.add_service_fee.amount} {paramsData?.params?.add_service_fee.denom}</p>
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
            {data?.service?.map((svc) => (
              <TableRow key={svc.id}>
                <TableCell>{svc.id}</TableCell>
                <TableCell>{svc.name}</TableCell>
                <TableCell className="text-blue-600 font-medium">{toTruncatedPoktAddress(svc.owner_address)}</TableCell>
                <TableCell>{svc.compute_units_per_relay}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}