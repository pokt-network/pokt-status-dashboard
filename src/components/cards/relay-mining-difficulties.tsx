import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { RelayMiningDifficultiesTable } from "../tables/relay-mining-difficulties";

export function RelayMiningDifficultiesCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle>Relay Mining Difficulties</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <RelayMiningDifficultiesTable
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