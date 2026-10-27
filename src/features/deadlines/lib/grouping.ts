import type { Deadline } from '@/core/api';
import { dayLabel, startOfDay } from '@/shared/lib/dateFormat';

import type { DaySection } from '../types';
import { dueOf } from './urgency';

/** Agrupa por dia de vencimento, mantendo a ordem de entrada. */
export function groupByDay(items: Deadline[], now = Date.now()): DaySection[] {
  const sections = new Map<string, DaySection>();
  for (const d of items) {
    const due = dueOf(d);
    const key = String(startOfDay(due.getTime()));
    let section = sections.get(key);
    if (!section) {
      section = { key, title: dayLabel(due, now), data: [] };
      sections.set(key, section);
    }
    section.data.push(d);
  }
  return [...sections.values()];
}
