import type { Deadline } from '@/core/api';
import { formatTime } from '@/shared/lib/dateFormat';

import { PERSONAL_EVENT_LABEL } from '../constants';
import { dueOf, startOf } from './urgency';

/** "até 23:59" para entregas; "19:00–21:00" para eventos com duração. */
export function timeRange(d: Deadline, separator = '–'): string {
  const due = formatTime(dueOf(d));
  return d.instant ? `até ${due}` : `${formatTime(startOf(d))}${separator}${due}`;
}

export function courseLabel(d: Deadline): string {
  return d.courseCode || PERSONAL_EVENT_LABEL;
}
