import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useServiceParams() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['service-params'],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.service.params();
      if ('params' in res) return res;
      throw new Error(res.message || 'Failed to fetch service parameters');
    },
  });
}