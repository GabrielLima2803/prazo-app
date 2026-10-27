import type { MoodleStatus } from '@/core/api';
import { stripProtocol } from '@/shared/lib/text';

const FALLBACK_TITLE = 'Conta do Moodle';
const FALLBACK_HOST = 'Moodle';

export function accountTitle(m: MoodleStatus | undefined): string {
  return m?.fullName ?? m?.siteName ?? FALLBACK_TITLE;
}

export function accountSubtitle(m: MoodleStatus | undefined): string {
  const host = m?.baseUrl ? stripProtocol(m.baseUrl) : FALLBACK_HOST;
  return m?.method === 'ical' ? `${host} · pelo calendário` : host;
}

export function firstName(m: MoodleStatus | undefined): string | undefined {
  return m?.fullName?.split(' ')[0];
}
