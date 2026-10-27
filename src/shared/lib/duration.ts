import { plural } from './text';
import { MINUTES_PER_DAY, MINUTES_PER_HOUR, MINUTES_PER_WEEK } from './time';

/** Antecedência de um lembrete: 4320 → "3 dias antes", 120 → "2 h antes". */
export function formatReminder(minutes: number): string {
  if (minutes % MINUTES_PER_WEEK === 0) {
    const weeks = minutes / MINUTES_PER_WEEK;
    return `${weeks} ${plural(weeks, 'semana')} antes`;
  }
  if (minutes % MINUTES_PER_DAY === 0) {
    const days = minutes / MINUTES_PER_DAY;
    return `${days} ${plural(days, 'dia')} antes`;
  }
  if (minutes % MINUTES_PER_HOUR === 0) return `${minutes / MINUTES_PER_HOUR} h antes`;
  return `${minutes} min antes`;
}

/** Versão curta, para chips: 10080 → "1 sem", 1440 → "1 d". */
export function formatReminderShort(minutes: number): string {
  if (minutes % MINUTES_PER_WEEK === 0) return `${minutes / MINUTES_PER_WEEK} sem`;
  if (minutes % MINUTES_PER_DAY === 0) return `${minutes / MINUTES_PER_DAY} d`;
  if (minutes % MINUTES_PER_HOUR === 0) return `${minutes / MINUTES_PER_HOUR} h`;
  return `${minutes} min`;
}
