import { DAY_MS, HOUR_MS } from '@/shared/lib/time';

import type { Course, Deadline, Preferences } from '../types';
import { DEMO_COURSES, DEMO_DEADLINE_URL, DEMO_DEFAULT_REMINDERS, DEMO_PALETTE, DEMO_SEEDS, DEMO_TYPE_LABELS } from './fixtures';

/** Na demonstração, metade dos prazos passados aparece como entregue. */
const SUBMITTED_EVERY = 2;

function colorHex(colorId: string): string {
  return DEMO_PALETTE.find((c) => c.id === colorId)?.hex ?? DEMO_PALETTE[0]!.hex;
}

function courseColorId(code: string, prefs: Preferences): string {
  return prefs.courseColors[code] ?? DEMO_COURSES[code]!.colorId;
}

function endDate(daysFromNow: number, hhmm: string, now: number): Date {
  const [hours = 0, minutes = 0] = hhmm.split(':').map(Number);
  const end = new Date(now + daysFromNow * DAY_MS);
  end.setHours(hours, minutes, 0, 0);
  return end;
}

export function buildDeadlines(prefs: Preferences, now = Date.now()): Deadline[] {
  return DEMO_SEEDS.map((seed, i) => {
    const { course: code, type, title, daysFromNow, durationHours = 0, description = '' } = seed;
    const end = endDate(daysFromNow, seed.endsAt, now);
    const start = new Date(end.getTime() - durationHours * HOUR_MS);
    const colorId = courseColorId(code, prefs);
    const label = DEMO_TYPE_LABELS[type];
    return {
      id: `demo-${i}`,
      courseCode: code,
      courseName: DEMO_COURSES[code]!.name,
      type,
      label,
      phase: 'due',
      title,
      displayTitle: `[${code}] ${label}: ${title}`,
      description,
      url: DEMO_DEADLINE_URL,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      instant: durationHours === 0,
      submitted: daysFromNow < 0 && i % SUBMITTED_EVERY === 0,
      colorId,
      color: colorHex(colorId),
      reminders: prefs.reminders[type] ?? DEMO_DEFAULT_REMINDERS[type],
      hidden: prefs.hiddenCourses.includes(code) || prefs.hiddenTypes.includes(type),
    };
  });
}

export function buildCourses(prefs: Preferences, now = Date.now()): Course[] {
  const all = buildDeadlines(prefs, now);
  return Object.entries(DEMO_COURSES).map(([code, course]) => {
    const mine = all.filter((d) => d.courseCode === code);
    const pending = mine.filter((d) => new Date(d.endsAt).getTime() > now);
    const colorId = courseColorId(code, prefs);
    return {
      code,
      name: course.name,
      colorId,
      color: colorHex(colorId),
      hidden: prefs.hiddenCourses.includes(code),
      total: mine.length,
      pending: pending.length,
      nextDue: pending[0]?.endsAt ?? null,
    };
  });
}
