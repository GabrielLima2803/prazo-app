import type { Course } from '@/core/api';
import { relative } from '@/shared/lib/dateFormat';
import { plural } from '@/shared/lib/text';

/** Quantos caracteres da sigla cabem no quadrado colorido. */
export const COURSE_ABBREVIATION_LENGTH = 3;

export const abbreviate = (code: string) => code.slice(0, COURSE_ABBREVIATION_LENGTH);

/** "2 pendentes · próximo em 3d 4h" ou "5 prazos · nada pendente". */
export function courseSummary(c: Course, now: number): string {
  if (c.pending > 0 && c.nextDue) {
    return `${c.pending} ${plural(c.pending, 'pendente')} · próximo ${relative(new Date(c.nextDue), now)}`;
  }
  return `${c.total} ${plural(c.total, 'prazo')} · nada pendente`;
}
