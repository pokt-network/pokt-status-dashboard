import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useApplications(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
  delegateeGatewayAddress?: string
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['applications', ...Object.values(params || {})],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.application.application(params);
      if ('applications' in res) return res;
      throw new Error(res.message || 'Failed to fetch applications');
    },
  });
}