import { useQuery } from '@tanstack/react-query';
import { usePocketApi } from '@/context/PocketApiProvider';

export function useSupplierParams() {
  const api = usePocketApi();
  return useQuery({
    queryKey: ['supplier-params'],
    queryFn: async () => {
      const res = await api.poktNetwork.poktroll.supplier.params();
      if ('params' in res) return res;
      throw new Error(res.message || 'Failed to fetch supplier parameters');
    },
  });
}