import { APP_LOCALE } from './locale';

import { capitalize } from './text';
import { DAY_MS, HOUR_MS, MINUTE_MS } from './time';

const weekdayDayFormat = new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'short', day: '2-digit', month: 'short' });
const fullDateFormat = new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
const timeFormat = new Intl.DateTimeFormat(APP_LOCALE, { hour: '2-digit', minute: '2-digit' });

/** Horas do dia em que cada saudação começa. */
const GREETING_HOURS = { morning: 5, afternoon: 12, evening: 18 } as const;

export const formatTime = (d: Date) => timeFormat.format(d);
export const formatFullDate = (d: Date) => capitalize(fullDateFormat.format(d));

export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** "2d 13h", "5h 20min", "18 min", "há 3d". */
export function countdown(target: Date, now = Date.now()): string {
  const diff = target.getTime() - now;
  const abs = Math.abs(diff);
  let out: string;
  if (abs >= DAY_MS) out = `${Math.floor(abs / DAY_MS)}d ${Math.floor((abs % DAY_MS) / HOUR_MS)}h`;
  else if (abs >= HOUR_MS) out = `${Math.floor(abs / HOUR_MS)}h ${Math.floor((abs % HOUR_MS) / MINUTE_MS)}min`;
  else out = `${Math.max(1, Math.floor(abs / MINUTE_MS))} min`;
  return diff < 0 ? `há ${out}` : out;
}

/** "há 5 min", "em 27 min". */
export function relative(target: Date, now = Date.now()): string {
  const c = countdown(target, now);
  return target.getTime() < now ? c : `em ${c}`;
}

/** "Hoje", "Amanhã", "Ontem" ou "Qua, 05 nov". */
export function dayLabel(date: Date, now = Date.now()): string {
  const days = Math.round((startOfDay(date.getTime()) - startOfDay(now)) / DAY_MS);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  if (days === -1) return 'Ontem';
  return capitalize(weekdayDayFormat.format(date).replace(/\./g, ''));
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < GREETING_HOURS.morning) return 'Boa madrugada';
  if (h < GREETING_HOURS.afternoon) return 'Bom dia';
  if (h < GREETING_HOURS.evening) return 'Boa tarde';
  return 'Boa noite';
}
