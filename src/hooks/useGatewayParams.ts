import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useGatewayParams() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['gateway-params'],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.gateway.params();
      if ('params' in res) return res;
      throw new Error(res.message || 'Failed to fetch gateway parameters');
    },
  });
}