import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useConnection } from '@/state/connection';

import type { MoodleLogin, Preferences } from './types';

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

export function useMoodle() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'moodle'], queryFn: () => api.moodle() });
}

type ConnectRequest = { kind: 'login'; login: MoodleLogin } | { kind: 'ical'; icalUrl: string };

/** Conecta o Moodle e recarrega tudo: os prazos passam a vir da conta nova. */
export function useConnectMoodle() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: ConnectRequest) => (req.kind === 'login' ? api.moodleLogin(req.login) : api.moodleICal(req.icalUrl)),
    onSuccess: (status) => {
      qc.setQueryData([key, 'moodle'], status);
      qc.resetQueries({ queryKey: [key, 'deadlines'] });
      qc.resetQueries({ queryKey: [key, 'courses'] });
      qc.invalidateQueries({ queryKey: [key, 'status'] });
    },
  });
}

export function useDisconnectMoodle() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.moodleDisconnect(),
    // reset (e não remove): as telas abertas voltam ao estado inicial e
    // buscam de novo, recebendo "moodle_not_connected".
    onSuccess: (status) => {
      qc.setQueryData([key, 'moodle'], status);
      qc.resetQueries({ queryKey: [key, 'deadlines'] });
      qc.resetQueries({ queryKey: [key, 'courses'] });
    },
  });
}
