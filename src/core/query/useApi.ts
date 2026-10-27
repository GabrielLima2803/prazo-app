import { useConnection } from '@/core/session';

/** API da conexão atual e o escopo das query keys. Só existe com sessão ativa. */
export function useApi() {
  const { api, key } = useConnection();
  if (!api) throw new Error('sem conexão');
  return { api, scope: key };
}
