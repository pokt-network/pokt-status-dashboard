import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SuppliersTable } from "../tables/suppliers";
import { useState } from "react";
import { DEFAULT_PAGINATION_PARAMS } from "@/utils/constants";
import { useSupplierParams } from "@/hooks/useSupplierParams";

export function SuppliersCard() {
  const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

  const { data } = useSupplierParams();

  return (
    <Card className="w-full min-w-md">
      <CardHeader>
      <div className="flex flex-row justify-between items-center gap-4">
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Staking Fee:</p>
              <p>{data?.params?.staking_fee.amount} {data?.params?.staking_fee.denom}</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="font-semibold">Min Stake:</p>  
              <p>{data?.params?.min_stake.amount} {data?.params?.min_stake.denom}</p>
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SuppliersTable
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