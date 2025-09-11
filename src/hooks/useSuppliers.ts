import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useSuppliers(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['suppliers', ...Object.values(params || {})],
    queryFn: async () => {
      const suppliers = [];
      let total = 0;
      const paginationLimit = params?.paginationLimit ?? 1000;
      console.log(`Fetching suppliers 0 to ${paginationLimit}`);
      let res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit });
      if ('supplier' in res) suppliers.push(...res.supplier);
      if ('pagination' in res) {
        total = parseInt(res.pagination.total);
      } else {
        throw new Error(res.message || 'Failed to fetch suppliers');
      }
      console.log({ total, count: suppliers.length });
      for (let i = paginationLimit; i < total; i += paginationLimit) {
        console.log(`Fetching suppliers ${i} to ${i + paginationLimit}`);
        res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationLimit, paginationOffset: i });
        if ('supplier' in res) suppliers.push(...res.supplier);
        else throw new Error(res.message || 'Failed to fetch suppliers');
        console.log({ total, count: suppliers.length });
      }
      if (suppliers.length === 0) throw new Error('Failed to fetch suppliers');
      return {
        supplier: suppliers,
        pagination: {
          next_key: res.pagination.next_key,
          total: suppliers.length.toString(),
        },
      };
    },
  });
}