import { createHttpApi, type PrazoApi } from '@/core/api';
import { createDemoApi } from '@/core/api/demo';

import type { Connection } from './types';

const DEMO_KEY = 'demo';
const NO_CONNECTION_KEY = 'none';

export const isDemo = (c: Connection | null) => c?.mode === 'demo';

export function apiFor(c: Connection | null): PrazoApi | null {
  if (!c) return null;
  return c.mode === 'demo' ? createDemoApi() : createHttpApi(c.baseUrl, c.token);
}

export function connectionKey(c: Connection | null): string {
  if (!c) return NO_CONNECTION_KEY;
  return c.mode === 'demo' ? DEMO_KEY : c.baseUrl;
}
