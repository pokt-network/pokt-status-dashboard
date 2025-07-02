import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ApplicationsTable } from "../tables/applications";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { useApplicationParams } from "@/hooks/useApplicationParams";

export function ApplicationsCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  const { data } = useApplicationParams();

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Max Delegated Gateways:</p>
              <p>{data?.params?.max_delegated_gateways}</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Min Stake:</p>
              <p>{data?.params?.min_stake.amount} {data?.params?.min_stake.denom}</p>
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ApplicationsTable
          params={{
            paginationKey: nextPageKey,
            paginationLimit: DEFAULT_PAGINATION_PARAMS.limit,
            paginationOffset: DEFAULT_PAGINATION_PARAMS.offset,
            paginationCountTotal: DEFAULT_PAGINATION_PARAMS.countTotal,
          }}
          setNextPageKey={setNextPageKey}
        />
      </CardContent>
    </Card>
  );
}