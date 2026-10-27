import { createHttpApi, PRIVACY_PATH, type PrazoApi } from '@/core/api';
import { trimTrailingSlash } from '@/core/api/http';
import { DEFAULT_SERVER } from '@/core/config';
import { createDemoApi } from '@/core/api/demo';

import type { Connection } from './types';

const DEMO_KEY = 'demo';
const NO_CONNECTION_KEY = 'none';

export const isDemo = (c: Connection | null) => c?.mode === 'demo';

export function apiFor(c: Connection | null): PrazoApi | null {
  if (!c) return null;
  return c.mode === 'demo' ? createDemoApi() : createHttpApi(c.baseUrl, c.token);
}

/** Servidor da conexão; a demonstração usa o servidor padrão. */
export function serverOf(c: Connection | null): string {
  return c?.mode === 'server' ? c.baseUrl : DEFAULT_SERVER;
}

export function privacyUrl(server: string): string {
  return trimTrailingSlash(server) + PRIVACY_PATH;
}

export function connectionKey(c: Connection | null): string {
  if (!c) return NO_CONNECTION_KEY;
  return c.mode === 'demo' ? DEMO_KEY : c.baseUrl;
}
