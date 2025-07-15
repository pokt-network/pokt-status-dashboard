import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";
import { useConnections } from "@/hooks/useConnections";

export function ConnectionsTable({params, setNextPageKey}: {
  params?: {
    paginationKey?: string;
    paginationOffset?: number;
    paginationLimit?: number;
    paginationCountTotal?: boolean;
    paginationReverse?: boolean;
  },
  setNextPageKey?: (nextPageKey: string) => void
}) {
  const { data, isLoading, error } = useConnections(params);
  
  const [pageKeys, setPageKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
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
              <TableHead>Client ID</TableHead>
              <TableHead>Counterparty Client ID</TableHead>
              <TableHead>Connection ID</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Versions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell className="text-blue-600 font-medium">{connection.client_id}</TableCell>
                <TableCell>{connection.counterparty.client_id}</TableCell>
                <TableCell>{connection.id}</TableCell>
                <TableCell>{connection.state}</TableCell>
                <TableCell>{connection.versions.map((version) => version.identifier).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}