import type { Deadline } from '@/core/api';

import { URGENCY_THRESHOLDS_MS } from '../constants';
import type { Urgency } from '../types';

export function dueOf(d: Deadline): Date {
  return new Date(d.endsAt);
}

export function startOf(d: Deadline): Date {
  return new Date(d.startsAt);
}

export function timeLeft(d: Deadline, now = Date.now()): number {
  return dueOf(d).getTime() - now;
}

export function isPast(d: Deadline, now = Date.now()): boolean {
  return timeLeft(d, now) < 0;
}

export function urgency(d: Deadline, now = Date.now()): Urgency {
  if (d.submitted) return 'done';
  const left = timeLeft(d, now);
  if (left < 0) return 'overdue';
  if (left < URGENCY_THRESHOLDS_MS.critical) return 'critical';
  if (left < URGENCY_THRESHOLDS_MS.soon) return 'soon';
  return 'later';
}
