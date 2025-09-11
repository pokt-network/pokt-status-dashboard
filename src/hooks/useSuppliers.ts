import { useQuery } from '@tanstack/react-query';
import { SupplierResponse } from '@/utils/types';

export function useSuppliers(params?: {
  paginationKey?: string,
  paginationOffset?: number,
  paginationLimit?: number,
  paginationCountTotal?: boolean,
  paginationReverse?: boolean,
}) {
  return useQuery({
    queryKey: ['suppliers', ...Object.values(params || {})],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.paginationKey !== undefined) queryParams.append("paginationKey", params.paginationKey);
        if (params.paginationOffset !== undefined) queryParams.append("paginationOffset", params.paginationOffset.toString());
        if (params.paginationLimit !== undefined) queryParams.append("paginationLimit", params.paginationLimit.toString());
        if (params.paginationCountTotal !== undefined) queryParams.append("paginationCountTotal", String(params.paginationCountTotal));
        if (params.paginationReverse !== undefined) queryParams.append("paginationReverse", String(params.paginationReverse));
      }
      const res = await fetch(`/api/suppliers?${queryParams.toString()}`);
      const data = await res.json();
      return data as SupplierResponse;
    },
  });
}