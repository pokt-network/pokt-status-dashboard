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
import { useTokenomics } from "@/hooks/useTokenomics";

export function TokenomicsTable() {
  const { data, isLoading, error } = useTokenomics();

  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2">Tokenomics</h2>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading suppliers.</div>
      ) : data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DAO Reward Address</TableHead>
              <TableHead>Global Inflation Per Claim</TableHead>
              <TableHead>Mint Allocation %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{toTruncatedPoktAddress(data?.dao_reward_address)}</TableCell>
              <TableCell>{data?.global_inflation_per_claim}</TableCell>
              <TableCell>
                App: {data?.mint_allocation_percentages.application}%<br />
                DAO: {data?.mint_allocation_percentages.dao}%<br />
                Proposer: {data?.mint_allocation_percentages.proposer}%<br />
                Source Owner: {data?.mint_allocation_percentages.source_owner}%<br />
                Supplier: {data?.mint_allocation_percentages.supplier}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
}