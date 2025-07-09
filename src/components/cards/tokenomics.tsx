import { toTruncatedPoktAddress } from "@/utils/formatting"
import { useTokenomics } from "@/hooks/useTokenomics";
import { Card, CardContent, CardTitle } from "../ui/card";

export function TokenomicsCard() {
  const { data, isLoading, error } = useTokenomics();

  return (
    <div className="w-full min-w-md p-0 gap-1 border-none bg-none flex flex-col">
      <div className="rounded-lg p-4 text-white bg-primary mb-0">
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle className="text-white text-2xl font-bold">Tokenomics</CardTitle>
        </div>
      </div>
      <Card className="w-full min-w-md p-0 gap-1 border-none bg-none">
        <CardContent className="border-gray-200 border-2 p-4 rounded-lg">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading suppliers.</div>
          ) : data ? (
            <>
            <div>
              <p className="font-semibold">DAO Reward Address</p>
              <p>{toTruncatedPoktAddress(data?.dao_reward_address)}</p>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Global Inflation Per Claim</p>
              <p>{data?.global_inflation_per_claim}</p>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Mint Allocation %</p>
              <div className="flex justify-between gap-4">
                <p>App</p>
                <p>{data?.mint_allocation_percentages.application}%</p>
              </div>
              <div className="flex justify-between gap-4">
                <p>DAO</p>
                <p>{data?.mint_allocation_percentages.dao}%</p>
              </div>
              <div className="flex justify-between gap-4">
                <p>Proposer</p>
                <p>{data?.mint_allocation_percentages.proposer}%</p>
              </div>
              <div className="flex justify-between gap-4">
                <p>Source Owner</p>
                <p>{data?.mint_allocation_percentages.source_owner}%</p>
              </div>
              <div className="flex justify-between gap-4">
                <p>Supplier</p>
                <p>{data?.mint_allocation_percentages.supplier}%</p>
              </div>
            </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}