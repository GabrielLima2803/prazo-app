import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { ApiErrorCode, isApiError } from '@/core/api';

import { useConnection } from './ConnectionProvider';
import type { LogoutReason } from './types';

/** Erros do servidor que encerram a sessão, e o motivo mostrado no login. */
const LOGOUT_ERRORS: Partial<Record<string, LogoutReason>> = {
  [ApiErrorCode.Unauthorized]: 'session_expired',
  [ApiErrorCode.MoodleReauth]: 'moodle_reauth',
};

/**
 * Sessão expirada ou senha do Moodle trocada: volta para o login com o
 * motivo, em vez de mostrar um erro genérico.
 * Só o primeiro erro conta: ao sair, as consultas que ainda estavam no ar
 * voltam 401 e trocariam o motivo por "sessão expirada".
 */
export function useAuthErrorLogout() {
  const { connection, disconnect } = useConnection();
  const queryClient = useQueryClient();
  const leaving = useRef(false);

  useEffect(() => {
    if (connection) leaving.current = false;
  }, [connection]);

  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        const error = event.query.state.error;
        if (event.type !== 'updated' || !isApiError(error) || !error.code || leaving.current) return;
        const reason = LOGOUT_ERRORS[error.code];
        if (!reason) return;
        leaving.current = true;
        queryClient.clear();
        disconnect(reason);
      }),
    [queryClient, disconnect],
  );
}
