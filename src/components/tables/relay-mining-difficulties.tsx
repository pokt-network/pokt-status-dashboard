import { toTruncatedPoktAddress } from "@/utils/formatting"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useRelayMiningDifficulties } from "@/hooks/useRelayMiningDifficulties"
import { useState } from "react";
import { PaginationControls } from "../pagination/pagination-controls";

export function RelayMiningDifficultiesTable({params, setNextPageKey}: {
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
  const { data, isLoading, error } = useRelayMiningDifficulties(params);
  
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
              <TableHead>Block Height</TableHead>
              <TableHead>Service ID</TableHead>
              <TableHead>Number of Relays</TableHead>
              <TableHead>Target Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.relayMiningDifficulty.map((relay) => (
              <TableRow key={relay.service_id}>
                <TableCell>{relay.block_height}</TableCell>
                <TableCell>{relay.service_id}</TableCell>
                <TableCell>{relay.num_relays_ema}</TableCell>
                <TableCell>{relay.target_hash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}