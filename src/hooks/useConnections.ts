import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useConnections(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['connections', ...Object.values(params || {})],
    queryFn: async () => {
      const res = await api.ibc_core.connection.connections(params);
      if ('connections' in res) return res;
      throw new Error(res.message || 'Failed to fetch connections');
    },
  });
}