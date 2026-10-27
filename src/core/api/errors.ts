/** Códigos estáveis devolvidos pelo servidor no campo "code". */
export const ApiErrorCode = {
  Unauthorized: 'unauthorized',
  MoodleReauth: 'moodle_reauth',
  MoodleNotConnected: 'moodle_not_connected',
  InvalidLogin: 'invalid_login',
  MoodleAuthDown: 'moodle_auth_down',
  HostNotAllowed: 'host_not_allowed',
  TooManyUsers: 'too_many_users',
  TooManyAttempts: 'too_many_attempts',
  ExportUnavailable: 'export_unavailable',
  ServiceUnavailable: 'service_unavailable',
  NotICalendar: 'not_icalendar',
  InvalidUrl: 'invalid_url',
  EmptyFeed: 'empty_feed',
  MoodleUnreachable: 'moodle_unreachable',
} as const;

export type ApiErrorCodeValue = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** Código estável do servidor, ex.: "unauthorized", "invalid_login". */
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isApiError(e: unknown, code?: ApiErrorCodeValue): e is ApiError {
  return e instanceof ApiError && (code === undefined || e.code === code);
}

/** Texto apresentável de qualquer erro. */
export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
