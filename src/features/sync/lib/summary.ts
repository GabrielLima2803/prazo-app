import type { Run } from '@/core/api';

/** Resumo de uma sincronização: "Agenda atualizada: 2 novo(s), 1 removido(s)." */
export function syncSummary(r: Run): string {
  const parts = [
    r.created && `${r.created} novo(s)`,
    r.updated && `${r.updated} atualizado(s)`,
    r.deleted && `${r.deleted} removido(s)`,
  ].filter(Boolean);
  return parts.length ? `Agenda atualizada: ${parts.join(', ')}.` : 'Tudo em dia: nada mudou desde a última vez.';
}

/** Quantos prazos estão na agenda após a última sincronização bem-sucedida. */
export function eventsInCalendar(r: Run | null | undefined): number | null {
  return r?.ok ? r.total - r.hidden : null;
}

export function deleteBlockedMessage(count: number): string {
  return `${count} prazos sumiram de uma vez do Moodle. Por segurança, nada foi apagado da agenda.`;
}
