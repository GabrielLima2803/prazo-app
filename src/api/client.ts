import type { Course, DeadlineList, LoginResponse, Meta, MoodleLogin, MoodleStatus, PrazoApi, Preferences, Run, Status } from './types';

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

/** Garante coleções vazias mesmo se o servidor mandar null. */
export function normalizePreferences(p: Partial<Preferences> | null): Preferences {
  return {
    hiddenCourses: p?.hiddenCourses ?? [],
    hiddenTypes: p?.hiddenTypes ?? [],
    courseColors: p?.courseColors ?? {},
    reminders: p?.reminders ?? {},
  };
}

const TIMEOUT_MS = 15_000;
// POST /sync espera a sincronização inteira no servidor.
const SYNC_TIMEOUT_MS = 4 * 60_000;
// O login passa pelo Moodle e ainda baixa o calendário para conferir.
const LOGIN_TIMEOUT_MS = 60_000;

async function send<T>(root: string, path: string, init: RequestInit, timeout: number, token?: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res: Response;
  try {
    res = await fetch(root + path, {
      ...init,
      signal: controller.signal,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json', ...init.headers },
    });
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    throw new ApiError(aborted ? 'O servidor demorou demais para responder.' : 'Sem conexão com o servidor do Prazo. Confira a internet e tente de novo.');
  } finally {
    clearTimeout(timer);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(body?.error ?? `Erro ${res.status}`, res.status, body?.code);
  return body as T;
}

const trim = (url: string) => url.replace(/\/+$/, '');

/** Entrada no app: troca o login do Moodle por uma sessão do Prazo. */
export function createAuthApi(server: string) {
  const root = trim(server);
  return {
    login: (req: MoodleLogin) => send<LoginResponse>(root, '/auth/login', { method: 'POST', body: JSON.stringify(req) }, LOGIN_TIMEOUT_MS),
    loginICal: (icalUrl: string) =>
      send<LoginResponse>(root, '/auth/ical', { method: 'POST', body: JSON.stringify({ icalUrl }) }, LOGIN_TIMEOUT_MS),
  };
}

export function createHttpApi(server: string, token: string): PrazoApi {
  const root = trim(server);
  const request = <T,>(path: string, init: RequestInit = {}, timeout = TIMEOUT_MS) => send<T>(root, path, init, timeout, token);

  return {
    status: () => request<Status>('/api/v1/status'),
    meta: () => request<Meta>('/api/v1/meta'),
    deadlines: (refresh) => request<DeadlineList>(`/api/v1/deadlines${refresh ? '?refresh=1' : ''}`),
    courses: () => request<Course[]>('/api/v1/courses'),
    preferences: () => request<Preferences>('/api/v1/preferences').then(normalizePreferences),
    savePreferences: (p) =>
      request<Preferences>('/api/v1/preferences', { method: 'PUT', body: JSON.stringify(p) }).then(normalizePreferences),
    sync: () => request<Run>('/api/v1/sync', { method: 'POST' }, SYNC_TIMEOUT_MS),
    moodle: () => request<MoodleStatus>('/api/v1/moodle'),
    googleAuth: (returnTo) => request<{ authUrl: string }>('/api/v1/google/auth', { method: 'POST', body: JSON.stringify({ returnTo }) }),
    googleDisconnect: () => request<void>('/api/v1/google', { method: 'DELETE' }),
    logout: () => request<void>('/api/v1/auth/logout', { method: 'POST' }),
  };
}
