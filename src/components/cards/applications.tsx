import { Card, CardContent } from "../ui/card";
import { ApplicationsTable } from "../tables/applications";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";

export function ApplicationsCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  return (
    <div className="w-full min-w-md p-0 gap-1 border-none bg-none flex flex-col">
      <div className="rounded-lg p-4 text-white bg-primary mb-0">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-white text-2xl font-bold">Applications</h1>
        </div>
      </div>
      <Card className="w-full min-w-md p-0 gap-1 border-none bg-none">
        <CardContent className="border-gray-200 border-2 p-4 rounded-lg">
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
    </div>
  );
}