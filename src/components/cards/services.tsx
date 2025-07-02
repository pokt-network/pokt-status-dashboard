import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ServicesTable } from "../tables/services";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { useState } from "react";

export function ServicesCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ServicesTable
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