import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useConnectionParams() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['connection-params'],
    queryFn: async () => {
      const res = await api.ibc_core.connection.params();
      if ('params' in res) return res;
      throw new Error(res.message || 'Failed to fetch connection');
    },
  });
}