import type { Preferences } from './types';

export const EMPTY_PREFERENCES: Preferences = { hiddenCourses: [], hiddenTypes: [], courseColors: {}, reminders: {} };

/** Garante coleções vazias mesmo se o servidor mandar null. */
export function normalizePreferences(p: Partial<Preferences> | null): Preferences {
  return {
    hiddenCourses: p?.hiddenCourses ?? EMPTY_PREFERENCES.hiddenCourses,
    hiddenTypes: p?.hiddenTypes ?? EMPTY_PREFERENCES.hiddenTypes,
    courseColors: p?.courseColors ?? EMPTY_PREFERENCES.courseColors,
    reminders: p?.reminders ?? EMPTY_PREFERENCES.reminders,
  };
}
