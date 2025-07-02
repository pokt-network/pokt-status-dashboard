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
      const res = await api.poktNetwork.poktroll.supplier.supplier(params);
      if ('supplier' in res) return res;
      throw new Error(res.message || 'Failed to fetch suppliers');
    },
  });
}