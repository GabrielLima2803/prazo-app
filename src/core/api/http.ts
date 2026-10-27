import { MINUTE_MS, SECOND_MS } from '@/shared/lib/time';

import { ApiError } from './errors';

export const timeouts = {
  default: 15 * SECOND_MS,
  // POST /sync espera a sincronização inteira no servidor.
  sync: 4 * MINUTE_MS,
  // O login passa pelo Moodle e ainda baixa o calendário para conferir.
  login: MINUTE_MS,
} as const;

const messages = {
  timeout: 'O servidor demorou demais para responder.',
  offline: 'Sem conexão com o servidor do Prazo. Confira a internet e tente de novo.',
  status: (status: number) => `Erro ${status}`,
};

const ABORT_ERROR = 'AbortError';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  timeout?: number;
}

interface ErrorBody {
  error?: string;
  code?: string;
}

export const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

/** Cliente HTTP mínimo: JSON, timeout, Bearer e erros como ApiError. */
export function createHttp(baseUrl: string, token?: string) {
  const root = trimTrailingSlash(baseUrl);

  return async function request<T>(path: string, { method = 'GET', body, timeout = timeouts.default }: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let res: Response;
    try {
      res = await fetch(root + path, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (e) {
      const aborted = e instanceof Error && e.name === ABORT_ERROR;
      throw new ApiError(aborted ? messages.timeout : messages.offline);
    } finally {
      clearTimeout(timer);
    }

    const payload: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const err = (payload ?? {}) as ErrorBody;
      throw new ApiError(err.error ?? messages.status(res.status), res.status, err.code);
    }
    return payload as T;
  };
}
