import type { Deadline } from '@/core/api';

import { STATS_WINDOWS_MS } from '../constants';
import type { DeadlineFilter, DeadlineStats } from '../types';
import { timeLeft } from './urgency';

export interface DeadlineBuckets {
  visible: Deadline[];
  upcoming: Deadline[];
  past: Deadline[];
  /** Próximo prazo ainda não entregue, mostrado em destaque. */
  nextUp: Deadline | undefined;
}

export function bucketize(all: Deadline[], now: number): DeadlineBuckets {
  const visible = all.filter((d) => !d.hidden);
  const upcoming = visible.filter((d) => timeLeft(d, now) >= 0);
  const past = visible.filter((d) => timeLeft(d, now) < 0).reverse();
  return { visible, upcoming, past, nextUp: upcoming.find((d) => !d.submitted) };
}

export function applyFilter(filter: DeadlineFilter, { visible, upcoming, past, nextUp }: DeadlineBuckets): Deadline[] {
  switch (filter) {
    case 'upcoming':
      // O destaque já aparece no topo; não repete na lista.
      return upcoming.filter((d) => d !== nextUp);
    case 'past':
      return past;
    case 'all':
      return visible;
  }
}

export function countStats(upcoming: Deadline[], now: number): DeadlineStats {
  return {
    today: upcoming.filter((d) => timeLeft(d, now) < STATS_WINDOWS_MS.today).length,
    week: upcoming.filter((d) => timeLeft(d, now) < STATS_WINDOWS_MS.week).length,
    semester: upcoming.length,
  };
}
