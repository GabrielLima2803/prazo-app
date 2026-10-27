import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { secureStorage, storageKeys } from '@/core/storage/secureStorage';

import { apiFor, connectionKey } from './connection';
import type { Connection, ConnectionState, LogoutReason } from './types';

const ConnectionContext = createContext<ConnectionState | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [logoutReason, setLogoutReason] = useState<LogoutReason | null>(null);
  // Dados de uma conta nunca podem aparecer para a próxima que entrar no
  // mesmo aparelho: o cache é limpo ao entrar e ao sair.
  const queryClient = useQueryClient();

  useEffect(() => {
    secureStorage
      .get(storageKeys.connection)
      .then((raw) => raw && setConnection(JSON.parse(raw) as Connection))
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const api = useMemo(() => apiFor(connection), [connection]);

  const connect = useCallback(async (c: Connection) => {
    await secureStorage.set(storageKeys.connection, JSON.stringify(c));
    queryClient.clear();
    setLogoutReason(null);
    setOnboarding(true);
    setConnection(c);
  }, [queryClient]);

  // Sai mesmo se o servidor estiver fora: a sessão local some de qualquer jeito.
  const disconnect = useCallback(
    async (reason?: LogoutReason) => {
      await api?.logout().catch(() => undefined);
      await secureStorage.remove(storageKeys.connection);
      queryClient.clear();
      setLogoutReason(reason ?? null);
      setConnection(null);
    },
    [api, queryClient],
  );

  const finishOnboarding = useCallback(() => setOnboarding(false), []);

  const value = useMemo<ConnectionState>(
    () => ({
      ready,
      connection,
      api,
      key: connectionKey(connection),
      onboarding,
      logoutReason,
      connect,
      finishOnboarding,
      disconnect,
    }),
    [ready, connection, api, onboarding, logoutReason, connect, finishOnboarding, disconnect],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnection(): ConnectionState {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnection fora do ConnectionProvider');
  return ctx;
}
