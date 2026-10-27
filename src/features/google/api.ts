import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';

import { authorizeGoogle } from './lib/authorize';

export function useConnectGoogle() {
  const { api, scope } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authorizeGoogle(api),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.all(scope) }),
  });
}

export function useDisconnectGoogle() {
  const { api, scope } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.googleDisconnect(),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.status(scope) }),
  });
}
