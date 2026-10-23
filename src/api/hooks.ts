import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useConnection } from '@/state/connection';

import type { Preferences } from './types';

function useApi() {
  const { api, key } = useConnection();
  if (!api) throw new Error('sem conexão');
  return { api, key };
}

export function useDeadlines() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'deadlines'], queryFn: () => api.deadlines() });
}

export function useCourses() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'courses'], queryFn: () => api.courses() });
}

export function useStatus() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'status'], queryFn: () => api.status(), refetchInterval: 30_000 });
}

export function useMeta() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'meta'], queryFn: () => api.meta(), staleTime: Infinity });
}

export function usePreferences() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'preferences'], queryFn: () => api.preferences() });
}

/** Puxa o Moodle de novo, ignorando o cache do servidor (pull-to-refresh). */
export function useRefreshDeadlines() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.deadlines(true),
    onSuccess: (data) => {
      qc.setQueryData([key, 'deadlines'], data);
      qc.invalidateQueries({ queryKey: [key, 'courses'] });
    },
  });
}

/** Salva com atualização otimista: a tela muda na hora e volta se falhar. */
export function useSavePreferences() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  const prefsKey = [key, 'preferences'];
  return useMutation({
    mutationFn: (p: Preferences) => api.savePreferences(p),
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: prefsKey });
      const previous = qc.getQueryData<Preferences>(prefsKey);
      qc.setQueryData(prefsKey, next);
      return { previous };
    },
    onError: (_e, _p, ctx) => ctx?.previous && qc.setQueryData(prefsKey, ctx.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useSyncNow() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.sync(),
    onSettled: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}
