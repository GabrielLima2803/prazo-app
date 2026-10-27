import { useMemo, useState } from 'react';

import { useNow } from '@/shared/hooks/useNow';

import { useDeadlines } from '../api';
import { DEFAULT_FILTER } from '../constants';
import { groupByDay } from '../lib/grouping';
import { applyFilter, bucketize, countStats } from '../lib/selectors';
import type { DeadlineFilter } from '../types';

/** Tudo o que a tela de prazos precisa: dados, filtro, seções e contadores. */
export function useDeadlineFeed() {
  const now = useNow();
  const [filter, setFilter] = useState<DeadlineFilter>(DEFAULT_FILTER);
  const query = useDeadlines();

  const buckets = useMemo(() => bucketize(query.data?.deadlines ?? [], now), [query.data, now]);
  const sections = useMemo(() => groupByDay(applyFilter(filter, buckets), now), [filter, buckets, now]);
  const stats = useMemo(() => countStats(buckets.upcoming, now), [buckets.upcoming, now]);

  return { query, now, filter, setFilter, sections, stats, nextUp: buckets.nextUp };
}
