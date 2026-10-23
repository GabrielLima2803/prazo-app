import type { Course, DeadlineList, Meta, MoodleStatus, PrazoApi, Preferences, Run, Status } from './types';

/** Garante coleções vazias mesmo se o servidor mandar null. */
export function normalizePreferences(p: Partial<Preferences> | null): Preferences {
  return {
    hiddenCourses: p?.hiddenCourses ?? [],
    hiddenTypes: p?.hiddenTypes ?? [],
    courseColors: p?.courseColors ?? {},
    reminders: p?.reminders ?? {},
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** Código estável do servidor, ex.: "moodle_not_connected", "invalid_login". */
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const TIMEOUT_MS = 15_000;
// POST /sync espera a sincronização inteira no servidor.
const SYNC_TIMEOUT_MS = 4 * 60_000;

export function createHttpApi(baseUrl: string, token: string): PrazoApi {
  const root = baseUrl.replace(/\/+$/, '');

  async function request<T>(path: string, init: RequestInit = {}, timeout = TIMEOUT_MS): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res: Response;
    try {
      res = await fetch(root + path, {
        ...init,
        signal: controller.signal,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers },
      });
    } catch (e) {
      const aborted = e instanceof Error && e.name === 'AbortError';
      throw new ApiError(aborted ? 'O servidor demorou demais para responder.' : 'Não foi possível alcançar o servidor. Ele está ligado e na mesma rede?');
    } finally {
      clearTimeout(timer);
    }
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = res.status === 401 ? 'Token inválido.' : (body?.error ?? `Erro ${res.status}`);
      throw new ApiError(msg, res.status, body?.code);
    }
    return body as T;
  }

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
    // Login e teste do calendário passam pelo Moodle: dão mais tempo.
    moodleLogin: (req) => request<MoodleStatus>('/api/v1/moodle/login', { method: 'POST', body: JSON.stringify(req) }, 60_000),
    moodleICal: (icalUrl) => request<MoodleStatus>('/api/v1/moodle/ical', { method: 'POST', body: JSON.stringify({ icalUrl }) }, 60_000),
    moodleDisconnect: () => request<MoodleStatus>('/api/v1/moodle', { method: 'DELETE' }),
  };
}
