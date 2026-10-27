import { endpoints, REFRESH_QUERY } from './endpoints';
import { createHttp, timeouts } from './http';
import { normalizePreferences } from './normalize';
import type {
  AccountExport,
  AuthApi,
  Course,
  DeadlineList,
  GoogleAuthResponse,
  LoginResponse,
  Meta,
  MoodleStatus,
  PrazoApi,
  Preferences,
  Run,
  Status,
} from './types';

/** Entrada no app: troca o login do Moodle por uma sessão do Prazo. */
export function createAuthApi(server: string): AuthApi {
  const request = createHttp(server);
  return {
    login: (body) => request<LoginResponse>(endpoints.auth.login, { method: 'POST', body, timeout: timeouts.login }),
    loginICal: (icalUrl) => request<LoginResponse>(endpoints.auth.ical, { method: 'POST', body: { icalUrl }, timeout: timeouts.login }),
  };
}

export function createHttpApi(server: string, token: string): PrazoApi {
  const request = createHttp(server, token);
  return {
    status: () => request<Status>(endpoints.status),
    meta: () => request<Meta>(endpoints.meta),
    deadlines: (refresh) => request<DeadlineList>(endpoints.deadlines + (refresh ? REFRESH_QUERY : '')),
    courses: () => request<Course[]>(endpoints.courses),
    preferences: () => request<Preferences>(endpoints.preferences).then(normalizePreferences),
    savePreferences: (body) => request<Preferences>(endpoints.preferences, { method: 'PUT', body }).then(normalizePreferences),
    sync: () => request<Run>(endpoints.sync, { method: 'POST', timeout: timeouts.sync }),
    moodle: () => request<MoodleStatus>(endpoints.moodle),
    googleAuth: (returnTo) => request<GoogleAuthResponse>(endpoints.googleAuth, { method: 'POST', body: { returnTo } }),
    googleDisconnect: () => request<void>(endpoints.google, { method: 'DELETE' }),
    logout: () => request<void>(endpoints.auth.logout, { method: 'POST' }),
    exportAccount: () => request<AccountExport>(endpoints.accountExport),
    deleteAccount: () => request<void>(endpoints.account, { method: 'DELETE' }),
  };
}
