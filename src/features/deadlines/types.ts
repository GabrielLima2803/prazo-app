import type { Deadline } from '@/core/api';

export type Urgency = 'overdue' | 'critical' | 'soon' | 'later' | 'done';

export type DeadlineFilter = 'upcoming' | 'past' | 'all';

export interface DaySection {
  key: string;
  title: string;
  data: Deadline[];
}

export interface DeadlineStats {
  today: number;
  week: number;
  semester: number;
}
