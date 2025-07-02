import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ServicesTable } from "../tables/services";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { useState } from "react";
import { useServiceParams } from "@/hooks/useServiceParams";

export function ServicesCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  const { data } = useServiceParams();

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle>Services</CardTitle>
          <CardDescription>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Target Number of Relays:</p>
              <p>{data?.params?.target_num_relays}</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Add Service Fee:</p>
              <p>{data?.params?.add_service_fee.amount} {data?.params?.add_service_fee.denom}</p>
            </div>
          </CardDescription>
        </div>
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