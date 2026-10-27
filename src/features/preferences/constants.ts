import { MINUTES_PER_DAY, MINUTES_PER_HOUR, MINUTES_PER_WEEK } from '@/shared/lib/time';

/** Antecedências oferecidas para os lembretes, da maior para a menor. */
export const REMINDER_OPTIONS = [
  MINUTES_PER_WEEK,
  3 * MINUTES_PER_DAY,
  MINUTES_PER_DAY,
  12 * MINUTES_PER_HOUR,
  2 * MINUTES_PER_HOUR,
  MINUTES_PER_HOUR,
  30,
] as const;

/** O Google Agenda aceita até 5 lembretes por evento. */
export const MAX_REMINDERS_PER_EVENT = 5;
