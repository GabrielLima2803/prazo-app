import { ApiError } from './client';
import type { Course, Deadline, DeadlineType, Meta, MoodleStatus, PrazoApi, Preferences, Run } from './types';

// Modo demonstração: mesmos contratos da API, dados em memória. Permite ver o
// app sem um servidor rodando.

const palette: Meta['palette'] = [
  ['1', '#7986CB'], ['2', '#33B679'], ['3', '#8E24AA'], ['4', '#E67C73'], ['5', '#F6BF26'], ['6', '#F4511E'],
  ['7', '#039BE5'], ['8', '#616161'], ['9', '#3F51B5'], ['10', '#0B8043'], ['11', '#D50000'],
].map(([id, hex]) => ({ id: id!, hex: hex! }));

const defaults: Record<DeadlineType, number[]> = {
  assign: [4320, 1440, 120], exam: [10080, 1440], quiz: [1440, 120], forum: [1440], course_event: [1440], other: [1440],
};

const labels: Record<DeadlineType, string> = {
  assign: 'Entrega', exam: 'Prova', quiz: 'Questionário', forum: 'Fórum', course_event: 'Evento', other: 'Atividade',
};

const courses: Record<string, { name: string; color: string }> = {
  POO: { name: '2026/2_CCT_CCI251-03A_POO0002', color: '8' },
  EDA: { name: '2026/2_CCT_CCI251-03A_EDA1002', color: '7' },
  AOC: { name: '2026/2_CCT_CCI251-03B_AOC0005', color: '4' },
  CDI: { name: '2026/2_CCT_CCI251-03U_CDI2002', color: '5' },
  AMS: { name: '2026/2_CCT_CCI251-03A_AMS0003', color: '1' },
};

// [disciplina, tipo, título, dias a partir de hoje, hora final, duração em h, descrição]
type Seed = [code: string, type: DeadlineType, title: string, days: number, end: string, durationH?: number, description?: string];

const seeds: Seed[] = [
  ['EDA', 'assign', 'UPLOAD da Tarefa-1 FILA DE PRIORIDADE', 0, '23:59', 0, 'Implementar uma fila de prioridade com heap binário. Entregar o código-fonte e um relatório curto.'],
  ['POO', 'assign', 'Aula Prática 7 - Especificação de Interfaces em Java', 1, '23:59'],
  ['AMS', 'other', 'Definição de grupo para MVP', 3, '02:04'],
  ['CDI', 'exam', 'Prova 2 - Séries e Integrais', 4, '21:00', 2, 'Conteúdo: séries de potências, critérios de convergência e integrais impróprias.'],
  ['AOC', 'assign', 'Atividade Pipeline', 6, '23:59'],
  ['CDI', 'quiz', 'TAREFA 10: Série de Taylor', 8, '23:59'],
  ['POO', 'assign', 'Aula Prática 9 - Tratamento de Exceções em Java', 24, '02:05'],
  ['POO', 'assign', 'Entrega Etapa 3 do Trabalho (Persistência de Dados)', 38, '23:59'],
  ['EDA', 'assign', 'Upload da tarefa 2 - Priority Heap', 44, '02:04'],
  ['AOC', 'exam', 'Prova 2', 46, '21:00', 2],
  ['POO', 'assign', 'Aula Prática 6 - Coleções', -2, '23:59'],
  ['CDI', 'quiz', 'TAREFA 9: Intervalo de convergência', -1, '23:59'],
  ['AOC', 'assign', 'Exercício Slide', -21, '23:59'],
];

function build(prefs: Preferences): Deadline[] {
  const now = Date.now();
  return seeds.map(([code, type, title, days, endAt, durationH = 0, description = ''], i) => {
    const [hh, mm] = endAt.split(':').map(Number);
    const end = new Date(now + days * 86_400_000);
    end.setHours(hh!, mm!, 0, 0);
    const start = new Date(end.getTime() - durationH * 3_600_000);
    const colorId = prefs.courseColors[code] ?? courses[code]!.color;
    const label = labels[type];
    return {
      id: `demo-${i}`,
      courseCode: code,
      courseName: courses[code]!.name,
      type,
      label,
      phase: 'due',
      title,
      displayTitle: `[${code}] ${label}: ${title}`,
      description,
      url: 'https://moodle.joinville.udesc.br/my/',
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      instant: durationH === 0,
      submitted: days < 0 && i % 2 === 0,
      colorId,
      color: palette.find((c) => c.id === colorId)!.hex,
      reminders: prefs.reminders[type] ?? defaults[type],
      hidden: prefs.hiddenCourses.includes(code) || prefs.hiddenTypes.includes(type),
    };
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demoAccount: MoodleStatus = {
  connected: true, method: 'login', baseUrl: 'https://moodle.joinville.udesc.br', fullName: 'Aluno de Exemplo', siteName: 'Moodle CCT',
};

export function createDemoApi(): PrazoApi {
  let prefs: Preferences = { hiddenCourses: [], hiddenTypes: [], courseColors: {}, reminders: {} };
  let lastRun: Run | null = null;
  let moodle: MoodleStatus = { ...demoAccount, connectedAt: new Date().toISOString() };
  let googleAuthorized = true;
  const requireMoodle = () => {
    if (!moodle.connected) throw new ApiError('Nenhuma conta do Moodle conectada', 409, 'moodle_not_connected');
  };

  return {
    async status() {
      await wait(150);
      return {
        now: new Date().toISOString(),
        google: { authorized: googleAuthorized, calendarName: 'Prazo — UDESC', appAuth: true },
        lastRun,
        nextRun: new Date(Date.now() + 27 * 60_000).toISOString(),
      };
    },
    async meta() {
      return { palette, types: (Object.keys(labels) as DeadlineType[]).map((id) => ({ id, label: labels[id], defaultReminders: defaults[id] })) };
    },
    async deadlines() {
      await wait(350);
      requireMoodle();
      return { deadlines: build(prefs), fetchedAt: new Date().toISOString() };
    },
    async courses() {
      await wait(200);
      requireMoodle();
      const all = build(prefs);
      return Object.entries(courses).map(([code, c]): Course => {
        const mine = all.filter((d) => d.courseCode === code);
        const pending = mine.filter((d) => new Date(d.endsAt).getTime() > Date.now());
        const colorId = prefs.courseColors[code] ?? c.color;
        return {
          code, name: c.name, colorId, color: palette.find((p) => p.id === colorId)!.hex,
          hidden: prefs.hiddenCourses.includes(code), total: mine.length, pending: pending.length,
          nextDue: pending[0]?.endsAt ?? null,
        };
      });
    },
    async preferences() {
      return prefs;
    },
    async savePreferences(p) {
      await wait(200);
      prefs = { ...p, hiddenCourses: [...new Set(p.hiddenCourses.map((c) => c.toUpperCase()))].sort() };
      return prefs;
    },
    async moodle() {
      return moodle;
    },
    async moodleLogin({ username, password }) {
      await wait(1200);
      if (!username.trim() || password.length < 3) throw new ApiError('Usuário ou senha inválidos', 422, 'invalid_login');
      moodle = { ...demoAccount, connectedAt: new Date().toISOString(), events: seeds.length };
      return moodle;
    },
    async moodleICal() {
      await wait(1000);
      moodle = { ...demoAccount, method: 'ical', fullName: undefined, connectedAt: new Date().toISOString(), events: seeds.length };
      return moodle;
    },
    async googleAuth() {
      // Na demonstração não há Google de verdade: a autorização "acontece"
      // logo depois que o navegador fecha.
      setTimeout(() => (googleAuthorized = true), 1500);
      return { authUrl: 'https://accounts.google.com/' };
    },
    async googleDisconnect() {
      googleAuthorized = false;
    },
    async moodleDisconnect() {
      moodle = { connected: false };
      return moodle;
    },
    async sync() {
      await wait(1600);
      requireMoodle();
      const visible = build(prefs).filter((d) => !d.hidden);
      const now = new Date().toISOString();
      lastRun = { startedAt: now, finishedAt: now, ok: true, total: seeds.length, created: lastRun ? 0 : visible.length, updated: lastRun ? visible.length : 0, hidden: seeds.length - visible.length, failed: 0 };
      return lastRun;
    },
  };
}
