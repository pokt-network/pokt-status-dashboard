import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ApplicationsTable } from "../tables/applications";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";

export function ApplicationsCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
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