import { MINUTES_PER_DAY, MINUTES_PER_HOUR, MINUTES_PER_WEEK } from '@/shared/lib/time';

import type { CalendarColor, DeadlineType, MoodleStatus } from '../types';

// Dados fictícios do modo demonstração.

/** As 11 cores de evento do Google Agenda. */
export const DEMO_PALETTE: CalendarColor[] = [
  { id: '1', hex: '#7986CB' },
  { id: '2', hex: '#33B679' },
  { id: '3', hex: '#8E24AA' },
  { id: '4', hex: '#E67C73' },
  { id: '5', hex: '#F6BF26' },
  { id: '6', hex: '#F4511E' },
  { id: '7', hex: '#039BE5' },
  { id: '8', hex: '#616161' },
  { id: '9', hex: '#3F51B5' },
  { id: '10', hex: '#0B8043' },
  { id: '11', hex: '#D50000' },
];

const THREE_DAYS = 3 * MINUTES_PER_DAY;
const TWO_HOURS = 2 * MINUTES_PER_HOUR;

export const DEMO_DEFAULT_REMINDERS: Record<DeadlineType, number[]> = {
  assign: [THREE_DAYS, MINUTES_PER_DAY, TWO_HOURS],
  exam: [MINUTES_PER_WEEK, MINUTES_PER_DAY],
  quiz: [MINUTES_PER_DAY, TWO_HOURS],
  forum: [MINUTES_PER_DAY],
  course_event: [MINUTES_PER_DAY],
  other: [MINUTES_PER_DAY],
};

export const DEMO_TYPE_LABELS: Record<DeadlineType, string> = {
  assign: 'Entrega',
  exam: 'Prova',
  quiz: 'Questionário',
  forum: 'Fórum',
  course_event: 'Evento',
  other: 'Atividade',
};

export interface DemoCourse {
  name: string;
  colorId: string;
}

export const DEMO_COURSES: Record<string, DemoCourse> = {
  POO: { name: '2026/2_CCT_CCI251-03A_POO0002', colorId: '8' },
  EDA: { name: '2026/2_CCT_CCI251-03A_EDA1002', colorId: '7' },
  AOC: { name: '2026/2_CCT_CCI251-03B_AOC0005', colorId: '4' },
  CDI: { name: '2026/2_CCT_CCI251-03U_CDI2002', colorId: '5' },
  AMS: { name: '2026/2_CCT_CCI251-03A_AMS0003', colorId: '1' },
};

export interface DemoSeed {
  course: keyof typeof DEMO_COURSES;
  type: DeadlineType;
  title: string;
  /** Dias a partir de hoje (negativo = passado). */
  daysFromNow: number;
  /** Horário final, "HH:MM". */
  endsAt: string;
  durationHours?: number;
  description?: string;
}

export const DEMO_SEEDS: DemoSeed[] = [
  {
    course: 'EDA',
    type: 'assign',
    title: 'UPLOAD da Tarefa-1 FILA DE PRIORIDADE',
    daysFromNow: 0,
    endsAt: '23:59',
    description: 'Implementar uma fila de prioridade com heap binário. Entregar o código-fonte e um relatório curto.',
  },
  { course: 'POO', type: 'assign', title: 'Aula Prática 7 - Especificação de Interfaces em Java', daysFromNow: 1, endsAt: '23:59' },
  { course: 'AMS', type: 'other', title: 'Definição de grupo para MVP', daysFromNow: 3, endsAt: '02:04' },
  {
    course: 'CDI',
    type: 'exam',
    title: 'Prova 2 - Séries e Integrais',
    daysFromNow: 4,
    endsAt: '21:00',
    durationHours: 2,
    description: 'Conteúdo: séries de potências, critérios de convergência e integrais impróprias.',
  },
  { course: 'AOC', type: 'assign', title: 'Atividade Pipeline', daysFromNow: 6, endsAt: '23:59' },
  { course: 'CDI', type: 'quiz', title: 'TAREFA 10: Série de Taylor', daysFromNow: 8, endsAt: '23:59' },
  { course: 'POO', type: 'assign', title: 'Aula Prática 9 - Tratamento de Exceções em Java', daysFromNow: 24, endsAt: '02:05' },
  { course: 'POO', type: 'assign', title: 'Entrega Etapa 3 do Trabalho (Persistência de Dados)', daysFromNow: 38, endsAt: '23:59' },
  { course: 'EDA', type: 'assign', title: 'Upload da tarefa 2 - Priority Heap', daysFromNow: 44, endsAt: '02:04' },
  { course: 'AOC', type: 'exam', title: 'Prova 2', daysFromNow: 46, endsAt: '21:00', durationHours: 2 },
  { course: 'POO', type: 'assign', title: 'Aula Prática 6 - Coleções', daysFromNow: -2, endsAt: '23:59' },
  { course: 'CDI', type: 'quiz', title: 'TAREFA 9: Intervalo de convergência', daysFromNow: -1, endsAt: '23:59' },
  { course: 'AOC', type: 'assign', title: 'Exercício Slide', daysFromNow: -21, endsAt: '23:59' },
];

export const DEMO_MOODLE_URL = 'https://moodle.joinville.udesc.br';
export const DEMO_DEADLINE_URL = `${DEMO_MOODLE_URL}/my/`;
export const DEMO_GOOGLE_AUTH_URL = 'https://accounts.google.com/';
export const DEMO_CALENDAR_NAME = 'Prazo — UDESC';

export const DEMO_ACCOUNT: MoodleStatus = {
  connected: true,
  method: 'login',
  baseUrl: DEMO_MOODLE_URL,
  fullName: 'Aluno de Exemplo',
  siteName: 'Moodle CCT',
};
