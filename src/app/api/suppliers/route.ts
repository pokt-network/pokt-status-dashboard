import { NextResponse } from "next/server";
import { PocketApi } from "@/utils/api";
import { env } from "@/utils/env";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paginationKey = searchParams.get("paginationKey");
  const paginationLimit = searchParams.get("paginationLimit");
  const paginationOffset = searchParams.get("paginationOffset");
  const paginationCountTotal = searchParams.get("paginationCountTotal") ?? undefined;
  const paginationReverse = searchParams.get("paginationReverse");
  const params = {
    paginationKey: paginationKey ?? undefined,
    paginationOffset: paginationOffset ? parseInt(paginationOffset) : undefined,
    paginationLimit: paginationLimit ? parseInt(paginationLimit) : 1000,
    paginationCountTotal: paginationCountTotal ? paginationCountTotal === "true" : undefined,
    paginationReverse: paginationReverse ? paginationReverse === "true" : undefined,
  }
  const api = new PocketApi(env.apiUrl);
  const suppliers = [];
  let total = 0;
  console.log(`Fetching suppliers 0 to ${paginationLimit}`);
  const res = await api.poktNetwork.poktroll.supplier.supplier({ ...params });
  if ('supplier' in res) suppliers.push(...res.supplier);
  if ('pagination' in res) {
    total = parseInt(res.pagination.total);
  } else {
    throw new Error(res.message || 'Failed to fetch suppliers');
  }
  console.log({ total, count: suppliers.length });
  const responses = await Promise.all(Array.from({ length: Math.ceil(total / params.paginationLimit) }, async (_, i) => {
    return api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationOffset: i * params.paginationLimit });
  }));
  for (const resp of responses) {
    if ('supplier' in resp) suppliers.push(...resp.supplier);
    else throw new Error(resp.message || 'Failed to fetch suppliers');
    console.log({ total, count: suppliers.length });
  }
  // for (let i = paginationLimit; i < total; i += paginationLimit) {
  //   console.log(`Fetching suppliers ${i} to ${i + paginationLimit}`);
  //   res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit, paginationOffset: i });
  //   if ('supplier' in res) suppliers.push(...res.supplier);
  //   else throw new Error(res.message || 'Failed to fetch suppliers');
  //   console.log({ total, count: suppliers.length });
  // }
  if (suppliers.length === 0) throw new Error('Failed to fetch suppliers');
  return NextResponse.json({
    supplier: suppliers,
    pagination: {
      next_key: res.pagination.next_key,
      total: suppliers.length.toString(),
    },
  });
}