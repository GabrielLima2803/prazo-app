import type { DeadlineType } from '@/core/api';
import type { SegmentOption } from '@/shared/components';
import { DAY_MS, SECOND_MS, WEEK_MS } from '@/shared/lib/time';
import type { IconName } from '@/shared/types/icons';
import type { PaletteColor } from '@/theme';

import type { DeadlineFilter, Urgency } from './types';

export const DEADLINE_TYPE_ICONS: Record<DeadlineType, IconName> = {
  assign: 'cloud-upload-outline',
  exam: 'school-outline',
  quiz: 'help-circle-outline',
  forum: 'chatbubbles-outline',
  course_event: 'calendar-outline',
  other: 'flag-outline',
};

/** Tempo restante abaixo do qual um prazo muda de urgência. */
export const URGENCY_THRESHOLDS_MS = {
  critical: DAY_MS,
  soon: 3 * DAY_MS,
} as const;

/** Janelas dos contadores do topo da lista. */
export const STATS_WINDOWS_MS = {
  today: DAY_MS,
  week: WEEK_MS,
} as const;

export const URGENCY_META: Record<Urgency, { label: string; icon: IconName; color: PaletteColor }> = {
  overdue: { label: 'Encerrado', icon: 'lock-closed', color: 'textSubtle' },
  critical: { label: 'Urgente', icon: 'flame', color: 'danger' },
  soon: { label: 'Em breve', icon: 'alarm', color: 'warning' },
  later: { label: 'Com folga', icon: 'leaf', color: 'success' },
  done: { label: 'Entregue', icon: 'checkmark-circle', color: 'success' },
};

/** Na pílula de contagem, "com folga" usa a cor principal em vez do verde de "entregue". */
export const COUNTDOWN_COLORS: Record<Urgency, PaletteColor> = {
  overdue: 'textSubtle',
  critical: 'danger',
  soon: 'warning',
  later: 'primary',
  done: 'success',
};

export const FILTER_OPTIONS: readonly SegmentOption<DeadlineFilter>[] = [
  { value: 'upcoming', label: 'Próximos' },
  { value: 'past', label: 'Passados' },
  { value: 'all', label: 'Todos' },
];

export const DEFAULT_FILTER: DeadlineFilter = 'upcoming';

export const EMPTY_STATES: Record<DeadlineFilter, { icon: IconName; title: string; message: string }> = {
  upcoming: { icon: 'sparkles-outline', title: 'Tudo em dia', message: 'Nenhum outro prazo pela frente. Aproveite!' },
  all: { icon: 'sparkles-outline', title: 'Tudo em dia', message: 'Nenhum outro prazo pela frente. Aproveite!' },
  past: { icon: 'archive-outline', title: 'Nada por aqui', message: 'Os prazos que já passaram aparecem aqui.' },
};

/** O detalhe atualiza a contagem com mais frequência que a lista. */
export const DETAIL_TICK_MS = 10 * SECOND_MS;

export const PERSONAL_EVENT_LABEL = 'Pessoal';
