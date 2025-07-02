import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useServices(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['services', ...Object.values(params || {})],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.service.service(params);
      if ('service' in res) return res;
      throw new Error(res.message || 'Failed to fetch services');
    },
  });
}