import { ApiErrorCode, errorMessage, isApiError } from '@/core/api';
import type { LogoutReason } from '@/core/session';

import type { LoginMode } from './constants';

const LOGIN_ERRORS: Partial<Record<string, string>> = {
  [ApiErrorCode.InvalidLogin]: 'Usuário ou senha incorretos.',
  [ApiErrorCode.MoodleAuthDown]: 'O login do Moodle da UDESC está fora do ar agora. Não é a sua senha — tente de novo mais tarde.',
  [ApiErrorCode.HostNotAllowed]: 'Este Moodle ainda não é atendido pelo Prazo.',
  [ApiErrorCode.TooManyUsers]: 'O Prazo atingiu o limite de usuários. Fale com quem te convidou.',
  [ApiErrorCode.TooManyAttempts]: 'Muitas tentativas. Espere um minuto e tente de novo.',
  [ApiErrorCode.ExportUnavailable]: 'Este Moodle não libera o calendário pelo login. Use “Entro pelo id.udesc”.',
  [ApiErrorCode.ServiceUnavailable]: 'O login pelo app está desativado neste Moodle. Use “Entro pelo id.udesc”.',
  [ApiErrorCode.NotICalendar]: 'Essa URL não devolveu um calendário. Gere de novo em Calendário → Exportar.',
  [ApiErrorCode.InvalidUrl]: 'Endereço inválido.',
  [ApiErrorCode.EmptyFeed]: 'O calendário veio vazio. Confira se é a conta certa.',
  [ApiErrorCode.MoodleUnreachable]: 'Não foi possível falar com o Moodle agora. Tente de novo em instantes.',
};

export const LOGOUT_REASON_MESSAGES: Record<LogoutReason, string> = {
  moodle_reauth: 'Sua senha do Moodle mudou. Entre de novo para continuar sincronizando — suas preferências estão salvas.',
  session_expired: 'Sua sessão terminou. Entre de novo.',
  account_deleted: 'Sua conta e seus dados foram excluídos do servidor do Prazo.',
};

export const INVALID_SERVER_MESSAGE = 'O servidor precisa ser um endereço https://.';
export const CUSTOM_SERVER_WARNING =
  'Este não é o servidor oficial do Prazo. A sua senha do Moodle será enviada para ele: só continue se confiar em quem o mantém.';

/** Mensagem amigável para o código do servidor, ou a mensagem crua do erro. */
export function loginErrorMessage(e: unknown): string {
  const friendly = isApiError(e) && e.code ? LOGIN_ERRORS[e.code] : undefined;
  return friendly ?? errorMessage(e);
}

/** Textos que mudam entre o login com senha e o login pela URL do calendário. */
export const MODE_COPY: Record<LoginMode, { intro: string; submit: string; switchLabel: string; switchIcon: 'link-outline' | 'key-outline' }> = {
  login: {
    intro: 'Entre com a sua conta do Moodle. A senha é usada só agora e não fica salva.',
    submit: 'Entrar com o Moodle',
    switchLabel: 'Entro pelo id.udesc / Office 365',
    switchIcon: 'link-outline',
  },
  ical: {
    intro: 'Para quem entra pelo id.udesc / Office 365: cole a URL de exportação do calendário.',
    submit: 'Entrar com o calendário',
    switchLabel: 'Voltar para usuário e senha',
    switchIcon: 'key-outline',
  },
};
