import { useQuery } from '@tanstack/react-query';
import { SupplierResponse } from '@/utils/types';

export function useSuppliers(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  return useQuery({
    queryKey: ['suppliers', ...Object.values(params || {})],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.paginationKey !== undefined) queryParams.append("paginationKey", params.paginationKey);
        if (params.paginationOffset !== undefined) queryParams.append("paginationOffset", params.paginationOffset.toString());
        if (params.paginationLimit !== undefined) queryParams.append("paginationLimit", params.paginationLimit.toString());
        if (params.paginationCountTotal !== undefined) queryParams.append("paginationCountTotal", String(params.paginationCountTotal));
        if (params.paginationReverse !== undefined) queryParams.append("paginationReverse", String(params.paginationReverse));
      }
      const res = await fetch(`/api/suppliers?${queryParams.toString()}`);
      const data = await res.json();
      return data as SupplierResponse;
      // const suppliers = [];
      // let total = 0;
      // const paginationLimit = params?.paginationLimit ?? 1000;
      // console.log(`Fetching suppliers 0 to ${paginationLimit}`);
      // const res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit });
      // if ('supplier' in res) suppliers.push(...res.supplier);
      // if ('pagination' in res) {
      //   total = parseInt(res.pagination.total);
      // } else {
      //   throw new Error(res.message || 'Failed to fetch suppliers');
      // }
      // console.log({ total, count: suppliers.length });
      // const responses = await Promise.all(Array.from({ length: Math.ceil(total / paginationLimit) }, async (_, i) => {
      //   return api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit, paginationOffset: i * paginationLimit });
      // }));
      // for (const resp of responses) {
      //   if ('supplier' in resp) suppliers.push(...resp.supplier);
      //   else throw new Error(resp.message || 'Failed to fetch suppliers');
      //   console.log({ total, count: suppliers.length });
      // }
      // // for (let i = paginationLimit; i < total; i += paginationLimit) {
      // //   console.log(`Fetching suppliers ${i} to ${i + paginationLimit}`);
      // //   res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit, paginationOffset: i });
      // //   if ('supplier' in res) suppliers.push(...res.supplier);
      // //   else throw new Error(res.message || 'Failed to fetch suppliers');
      // //   console.log({ total, count: suppliers.length });
      // // }
      // if (suppliers.length === 0) throw new Error('Failed to fetch suppliers');
      // return {
      //   supplier: suppliers,
      //   pagination: {
      //     next_key: res.pagination.next_key,
      //     total: suppliers.length.toString(),
      //   },
      // };
    },
  });
}