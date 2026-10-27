import type { CalendarColor, Course, DeadlineType, DeadlineTypeInfo, Preferences } from '@/core/api';

// Transformações puras das preferências: recebem o estado atual e devolvem o próximo.

function toggleItem<T>(list: T[], item: T, include: boolean): T[] {
  const without = list.filter((x) => x !== item);
  return include ? [...without, item] : without;
}

export function setCourseVisible(p: Preferences, code: string, visible: boolean): Preferences {
  return { ...p, hiddenCourses: toggleItem(p.hiddenCourses, code, !visible) };
}

export function setTypeVisible(p: Preferences, type: DeadlineType, visible: boolean): Preferences {
  return { ...p, hiddenTypes: toggleItem(p.hiddenTypes, type, !visible) };
}

export function setCourseColor(p: Preferences, code: string, colorId: string): Preferences {
  return { ...p, courseColors: { ...p.courseColors, [code]: colorId } };
}

export function isCourseVisible(p: Preferences, code: string): boolean {
  return !p.hiddenCourses.includes(code);
}

export function isTypeVisible(p: Preferences, type: DeadlineType): boolean {
  return !p.hiddenTypes.includes(type);
}

/** Id da cor escolhida para a disciplina, ou a cor que o servidor atribuiu. */
export function courseColorId(p: Preferences, course: Course): string {
  return p.courseColors[course.code] ?? course.colorId;
}

export function courseColorHex(p: Preferences, course: Course, palette: CalendarColor[]): string {
  const id = courseColorId(p, course);
  return palette.find((c) => c.id === id)?.hex ?? course.color;
}

export function activeReminders(p: Preferences, type: DeadlineTypeInfo): number[] {
  return p.reminders[type.id] ?? type.defaultReminders;
}

export function hasCustomReminders(p: Preferences, type: DeadlineType): boolean {
  return p.reminders[type] !== undefined;
}

/** Liga/desliga uma antecedência, mantendo a lista da maior para a menor. */
export function toggleReminder(p: Preferences, type: DeadlineTypeInfo, minutes: number): Preferences {
  const active = activeReminders(p, type);
  const next = active.includes(minutes) ? active.filter((m) => m !== minutes) : [...active, minutes].sort((a, b) => b - a);
  return { ...p, reminders: { ...p.reminders, [type.id]: next } };
}

/** Volta os lembretes do tipo ao padrão do servidor. */
export function resetReminders(p: Preferences, type: DeadlineType): Preferences {
  const { [type]: _removed, ...rest } = p.reminders;
  return { ...p, reminders: rest };
}
