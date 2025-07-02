import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useTokenomics() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['tokenomics'],
    queryFn: async () => {
      if (api.poktNetwork.poktroll.tokenomics && api.poktNetwork.poktroll.tokenomics.params) {
        const res = await api.poktNetwork.poktroll.tokenomics.params();
        if ('params' in res) return res.params;
        throw new Error(res.message || 'Failed to fetch tokenomics');
      }
      return null;
    },
  });
}