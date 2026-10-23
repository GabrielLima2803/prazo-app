import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

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

export function useMoodle() {
  const { api, key } = useApi();
  return useQuery({ queryKey: [key, 'moodle'], queryFn: () => api.moodle() });
}

const GOOGLE_POLL_MS = 2_000;
const GOOGLE_WAIT_MS = 3 * 60_000;

/**
 * Abre o consentimento do Google numa sessão de autenticação do sistema. O
 * Google devolve para o servidor (HTTPS público), que salva o token e manda o
 * navegador de volta ao app. A confirmação vem do /status, não do navegador:
 * o usuário pode fechar a aba antes do redirecionamento.
 */
export function useConnectGoogle() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // No navegador (expo web) o retorno seria http, que o servidor recusa.
      const returnTo = Platform.OS === 'web' ? undefined : Linking.createURL('google');
      const { authUrl } = await api.googleAuth(returnTo);
      if (returnTo) await WebBrowser.openAuthSessionAsync(authUrl, returnTo);
      else await WebBrowser.openBrowserAsync(authUrl);

      const deadline = Date.now() + GOOGLE_WAIT_MS;
      while (Date.now() < deadline) {
        const status = await api.status();
        if (status.google.authorized) return status;
        await new Promise((r) => setTimeout(r, GOOGLE_POLL_MS));
      }
      throw new Error('Não recebemos a autorização do Google. Tente de novo.');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [key] }),
  });
}

export function useDisconnectGoogle() {
  const { api, key } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.googleDisconnect(),
    onSettled: () => qc.invalidateQueries({ queryKey: [key, 'status'] }),
  });
}
