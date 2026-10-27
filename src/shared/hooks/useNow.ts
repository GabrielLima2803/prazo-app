import { useEffect, useState } from 'react';

import { SECOND_MS } from '@/shared/lib/time';

export const NOW_TICK_MS = 30 * SECOND_MS;

/** Re-renderiza a cada intervalo para manter as contagens regressivas vivas. */
export function useNow(intervalMs = NOW_TICK_MS): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
