import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';
import { useConnection } from '@/core/session';

export function useMoodle() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.moodle(scope), queryFn: () => api.moodle() });
}

export function useExportAccount() {
  const { api } = useApi();
  return useMutation({ mutationFn: () => api.exportAccount() });
}

/** Exclui a conta no servidor e, só depois de confirmado, sai do aparelho. */
export function useDeleteAccount() {
  const { api } = useApi();
  const { disconnect } = useConnection();
  return useMutation({
    mutationFn: () => api.deleteAccount(),
    onSuccess: () => disconnect('account_deleted'),
  });
}
