import type { PrazoApi } from '@/core/api';

/** server: sessão emitida pelo servidor depois do login com o Moodle. */
export type Connection = { mode: 'demo' } | { mode: 'server'; baseUrl: string; token: string };

/** Por que o app voltou para o login, para explicar ao usuário. */
export type LogoutReason = 'session_expired' | 'moodle_reauth' | 'account_deleted';

export interface ConnectionState {
  ready: boolean;
  connection: Connection | null;
  api: PrazoApi | null;
  /** Identifica a conexão atual; entra nas query keys para não misturar dados. */
  key: string;
  /** Acabou de entrar: mostrar o passo do Google antes dos prazos. */
  onboarding: boolean;
  logoutReason: LogoutReason | null;
  connect(c: Connection): Promise<void>;
  finishOnboarding(): void;
  disconnect(reason?: LogoutReason): Promise<void>;
}
