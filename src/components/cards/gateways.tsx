import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { GatewaysTable } from "../tables/gateways";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { useGatewayParams } from "@/hooks/useGatewayParams";

export function GatewaysCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  const { data } = useGatewayParams();

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle>Gateways</CardTitle>
          <CardDescription>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Min Stake:</p>
              <p>{data?.params?.min_stake.amount} {data?.params?.min_stake.denom}</p>
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <GatewaysTable
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