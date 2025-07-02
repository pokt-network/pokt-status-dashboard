import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useApplicationParams() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['application-params'],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.application.params();
      if ('params' in res) return res;
      throw new Error(res.message || 'Failed to fetch applications');
    },
  });
}