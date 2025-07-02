import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useRelayMiningDifficulties(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['relay-mining-difficulties', ...Object.values(params || {})],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.service.relay_mining_difficulty(params);
      if ('relayMiningDifficulty' in res) return res;
      throw new Error(res.message || 'Failed to fetch relay mining difficulty');
    },
  });
}