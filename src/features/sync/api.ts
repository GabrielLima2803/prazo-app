import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';
import { SECOND_MS } from '@/shared/lib/time';

const STATUS_REFETCH_INTERVAL_MS = 30 * SECOND_MS;

export function useStatus() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.status(scope), queryFn: () => api.status(), refetchInterval: STATUS_REFETCH_INTERVAL_MS });
}

export function useSyncNow() {
  const { api, scope } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.sync(),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.all(scope) }),
  });
}
