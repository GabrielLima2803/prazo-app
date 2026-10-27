import { MINUTE_MS, SECOND_MS } from '@/shared/lib/time';
import type { IconName } from '@/shared/types/icons';

/** Rota de retorno do consentimento (deep link prazo://google). */
export const GOOGLE_RETURN_PATH = 'google';

export const AUTH_POLL_INTERVAL_MS = 2 * SECOND_MS;
export const AUTH_TIMEOUT_MS = 3 * MINUTE_MS;

export const DEFAULT_CALENDAR_NAME = 'Prazo — UDESC';

export const GOOGLE_BENEFITS: readonly { icon: IconName; text: string }[] = [
  { icon: 'color-palette-outline', text: 'Uma cor por disciplina' },
  { icon: 'notifications-outline', text: 'Lembretes antes de cada entrega e prova' },
  { icon: 'sync-outline', text: 'Atualiza sozinho quando o Moodle muda' },
];

export const googleMessages = {
  timeout: 'Não recebemos a autorização do Google. Tente de novo.',
  connect: 'Conectar Google Agenda',
  waiting: 'Aguardando o Google…',
  appAuthUnavailable: 'O servidor ainda não está configurado para conectar o Google pelo app.',
  appAuthSetup: 'No servidor, configure PRAZO_PUBLIC_URL (Tailscale) e a credencial web, ou rode “prazo auth” no computador.',
  connectHint: `Conecte para criar a agenda “${DEFAULT_CALENDAR_NAME}” com os seus prazos e lembretes.`,
  banner: 'Conecte o Google Agenda em Ajustes para receber os prazos e lembretes na sua agenda.',
} as const;
