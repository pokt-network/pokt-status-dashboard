import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GatewaysTable } from "../tables/gateways";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";

export function GatewaysCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Gateways</CardTitle>
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