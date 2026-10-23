import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createHttpApi } from '@/api/client';
import { createDemoApi } from '@/api/demo';
import type { PrazoApi } from '@/api/types';
import { storage } from '@/lib/storage';

/** server: sessão emitida pelo servidor depois do login com o Moodle. */
export type Connection = { mode: 'demo' } | { mode: 'server'; baseUrl: string; token: string };

interface ConnectionState {
  ready: boolean;
  connection: Connection | null;
  api: PrazoApi | null;
  /** Identifica a conexão atual; entra nas query keys para não misturar dados. */
  key: string;
  /** Acabou de entrar: mostrar o passo do Google antes dos prazos. */
  onboarding: boolean;
  connect(c: Connection): Promise<void>;
  finishOnboarding(): void;
  disconnect(): Promise<void>;
}

const STORAGE_KEY = 'prazo.connection';
const Ctx = createContext<ConnectionState | null>(null);

function apiFor(c: Connection | null): PrazoApi | null {
  if (!c) return null;
  return c.mode === 'demo' ? createDemoApi() : createHttpApi(c.baseUrl, c.token);
}

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    storage
      .get(STORAGE_KEY)
      .then((raw) => raw && setConnection(JSON.parse(raw) as Connection))
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const api = useMemo(() => apiFor(connection), [connection]);

  const connect = useCallback(async (c: Connection) => {
    await storage.set(STORAGE_KEY, JSON.stringify(c));
    setOnboarding(true);
    setConnection(c);
  }, []);

  // Sai mesmo se o servidor estiver fora: a sessão local some de qualquer jeito.
  const disconnect = useCallback(async () => {
    await api?.logout().catch(() => undefined);
    await storage.remove(STORAGE_KEY);
    setConnection(null);
  }, [api]);

  const finishOnboarding = useCallback(() => setOnboarding(false), []);

  const value = useMemo<ConnectionState>(
    () => ({
      ready,
      connection,
      api,
      key: connection ? (connection.mode === 'demo' ? 'demo' : connection.baseUrl) : 'none',
      onboarding,
      connect,
      finishOnboarding,
      disconnect,
    }),
    [ready, connection, api, onboarding, connect, finishOnboarding, disconnect],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConnection(): ConnectionState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConnection fora do ConnectionProvider');
  return ctx;
}
