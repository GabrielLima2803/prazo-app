import type { Deadline } from '@/api/types';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const weekdayDay = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
const fullDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export const formatTime = (d: Date) => time.format(d);
export const formatFullDate = (d: Date) => capitalize(fullDate.format(d));

export function dueOf(d: Deadline): Date {
  return new Date(d.endsAt);
}

export type Urgency = 'overdue' | 'critical' | 'soon' | 'later' | 'done';

export function urgency(d: Deadline, now = Date.now()): Urgency {
  if (d.submitted) return 'done';
  const left = dueOf(d).getTime() - now;
  if (left < 0) return 'overdue';
  if (left < DAY) return 'critical';
  if (left < 3 * DAY) return 'soon';
  return 'later';
}

/** "2d 13h", "5h 20min", "18 min", "há 3d". */
export function countdown(target: Date, now = Date.now()): string {
  const diff = target.getTime() - now;
  const abs = Math.abs(diff);
  let out: string;
  if (abs >= DAY) out = `${Math.floor(abs / DAY)}d ${Math.floor((abs % DAY) / HOUR)}h`;
  else if (abs >= HOUR) out = `${Math.floor(abs / HOUR)}h ${Math.floor((abs % HOUR) / MIN)}min`;
  else out = `${Math.max(1, Math.floor(abs / MIN))} min`;
  return diff < 0 ? `há ${out}` : out;
}

/** "há 5 min", "em 27 min". */
export function relative(target: Date, now = Date.now()): string {
  const diff = target.getTime() - now;
  const c = countdown(target, now);
  return diff < 0 ? c : `em ${c}`;
}

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dayLabel(date: Date, now = Date.now()): string {
  const days = Math.round((startOfDay(date.getTime()) - startOfDay(now)) / DAY);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  if (days === -1) return 'Ontem';
  return capitalize(weekdayDay.format(date).replace(/\./g, ''));
}

export interface DaySection {
  key: string;
  title: string;
  data: Deadline[];
}

export function groupByDay(items: Deadline[], now = Date.now()): DaySection[] {
  const sections = new Map<string, DaySection>();
  for (const d of items) {
    const due = dueOf(d);
    const key = String(startOfDay(due.getTime()));
    let s = sections.get(key);
    if (!s) {
      s = { key, title: dayLabel(due, now), data: [] };
      sections.set(key, s);
    }
    s.data.push(d);
  }
  return [...sections.values()];
}

/** 4320 → "3 dias antes", 120 → "2 h antes". */
export function reminderLabel(minutes: number): string {
  if (minutes % 1440 === 0) {
    const d = minutes / 1440;
    return d === 7 ? '1 semana antes' : `${d} ${d === 1 ? 'dia' : 'dias'} antes`;
  }
  if (minutes % 60 === 0) return `${minutes / 60} h antes`;
  return `${minutes} min antes`;
}

export function shortReminder(minutes: number): string {
  if (minutes % 10080 === 0) return `${minutes / 10080} sem`;
  if (minutes % 1440 === 0) return `${minutes / 1440} d`;
  if (minutes % 60 === 0) return `${minutes / 60} h`;
  return `${minutes} min`;
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 5) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
