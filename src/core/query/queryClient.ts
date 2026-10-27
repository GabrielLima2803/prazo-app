import { QueryClient } from '@tanstack/react-query';

import { MINUTE_MS } from '@/shared/lib/time';

const STALE_TIME_MS = MINUTE_MS;
const RETRY_COUNT = 1;

export function createQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { staleTime: STALE_TIME_MS, retry: RETRY_COUNT } } });
}
