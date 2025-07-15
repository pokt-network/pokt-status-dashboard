import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useNodeConfig() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['node-config'],
    queryFn: async () => {
      const res = await api.node.config();
      if ('halt_height' in res) return res;
      throw new Error(res.message || 'Failed to fetch node config');
    },
  });
}