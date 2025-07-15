import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useNodeStatus() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['node-status'],
    queryFn: async () => {
      const res = await api.node.status();
      if ('app_hash' in res) return res;
      throw new Error(res.message || 'Failed to fetch node status');
    },
  });
}