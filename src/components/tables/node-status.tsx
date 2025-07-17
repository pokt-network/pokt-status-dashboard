import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useNodeStatus } from "@/hooks/useNodeStatus";

export function NodeStatusTable() {
  const { data, isLoading, error } = useNodeStatus();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col gap-2 text-sm min-w-xs">
          <div className="flex justify-between gap-4">
            <p className="font-semibold">App Hash:</p>
            <p>{data?.app_hash}</p>
          </div>
          <div className="flex justify-between gap-4">
            <p className="font-semibold">Earliest Store Height:</p>
            <p>{data?.earliest_store_height}</p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading applications.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App Hash</TableHead>
              <TableHead>Earliest Store Height</TableHead>
              <TableHead>Block Height</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Validator Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-blue-600 font-medium">{data?.app_hash}</TableCell>
              <TableCell>{data?.earliest_store_height}</TableCell>
              <TableCell>{data?.height}</TableCell>
              <TableCell>{data?.timestamp}</TableCell>
              <TableCell className="text-blue-600 font-medium">{data?.validator_hash}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}