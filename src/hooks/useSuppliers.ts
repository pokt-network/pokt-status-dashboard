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
      let nextPageKey = params?.paginationKey;
      let index = 0;
      while (true) {
        console.log(`Fetching suppliers ${index}`);
        index++;
        const res = await api.poktNetwork.poktroll.supplier.supplier({ ...params, paginationKey: nextPageKey });
        if ('pagination' in res) {
          console.log({ pagination: res.pagination });
        }
        if ('supplier' in res) suppliers.push(...res.supplier);
        if (!('pagination' in res) || !res.pagination.next_key) break;
        nextPageKey = res.pagination.next_key;
      }
      if (suppliers.length === 0) throw new Error('Failed to fetch suppliers');
      return {
        supplier: suppliers,
        pagination: {
          next_key: nextPageKey,
          total: suppliers.length.toString(),
        },
      };
    },
  });
}