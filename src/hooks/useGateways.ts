import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useGateways(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['gateways', ...Object.values(params || {})],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.gateway.gateway(params);
      if ('gateways' in res) return res;
      throw new Error(res.message || 'Failed to fetch gateways');
    },
  });
}