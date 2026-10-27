import { MINUTE_MS, SECOND_MS, sleep } from '@/shared/lib/time';

import { EMPTY_PREFERENCES } from '../normalize';
import type { DeadlineType, MoodleStatus, PrazoApi, Preferences, Run } from '../types';
import { buildCourses, buildDeadlines } from './build';
import {
  DEMO_ACCOUNT,
  DEMO_CALENDAR_NAME,
  DEMO_DEFAULT_REMINDERS,
  DEMO_GOOGLE_AUTH_URL,
  DEMO_PALETTE,
  DEMO_SEEDS,
  DEMO_TYPE_LABELS,
} from './fixtures';

// Modo demonstração: mesmos contratos da API, dados em memória. Permite ver o
// app sem um servidor rodando.

/** Latências simuladas, para a interface mostrar os estados de carregamento. */
const latency = {
  status: 150,
  deadlines: 350,
  courses: 200,
  savePreferences: 200,
  sync: 1_600,
  googleConsent: 1.5 * SECOND_MS,
} as const;

const NEXT_SYNC_IN_MS = 27 * MINUTE_MS;

export function createDemoApi(): PrazoApi {
  let prefs: Preferences = EMPTY_PREFERENCES;
  let lastRun: Run | null = null;
  let googleAuthorized = true;
  const moodle: MoodleStatus = { ...DEMO_ACCOUNT, connectedAt: new Date().toISOString() };

  return {
    async status() {
      await sleep(latency.status);
      return {
        now: new Date().toISOString(),
        google: { authorized: googleAuthorized, calendarName: DEMO_CALENDAR_NAME, appAuth: true },
        lastRun,
        nextRun: new Date(Date.now() + NEXT_SYNC_IN_MS).toISOString(),
      };
    },
    async meta() {
      const types = Object.keys(DEMO_TYPE_LABELS) as DeadlineType[];
      return {
        palette: DEMO_PALETTE,
        types: types.map((id) => ({ id, label: DEMO_TYPE_LABELS[id], defaultReminders: DEMO_DEFAULT_REMINDERS[id] })),
      };
    },
    async deadlines() {
      await sleep(latency.deadlines);
      return { deadlines: buildDeadlines(prefs), fetchedAt: new Date().toISOString() };
    },
    async courses() {
      await sleep(latency.courses);
      return buildCourses(prefs);
    },
    async preferences() {
      return prefs;
    },
    async savePreferences(p) {
      await sleep(latency.savePreferences);
      prefs = { ...p, hiddenCourses: [...new Set(p.hiddenCourses.map((c) => c.toUpperCase()))].sort() };
      return prefs;
    },
    async moodle() {
      return moodle;
    },
    async googleAuth() {
      // Na demonstração não há Google de verdade: a autorização "acontece"
      // logo depois que o navegador fecha.
      setTimeout(() => (googleAuthorized = true), latency.googleConsent);
      return { authUrl: DEMO_GOOGLE_AUTH_URL };
    },
    async googleDisconnect() {
      googleAuthorized = false;
    },
    async logout() {},
    async exportAccount() {
      return {
        exportedAt: new Date().toISOString(),
        user: { id: 'demo', host: 'moodle.joinville.udesc.br', moodleUserId: 0, name: moodle.fullName, createdAt: moodle.connectedAt ?? '' },
        moodle,
        google: { authorized: googleAuthorized, calendarName: DEMO_CALENDAR_NAME },
        preferences: prefs,
        note: 'Modo demonstração: nada disso está em um servidor.',
      };
    },
    async deleteAccount() {
      prefs = EMPTY_PREFERENCES;
      lastRun = null;
    },
    async sync() {
      await sleep(latency.sync);
      const total = DEMO_SEEDS.length;
      const visible = buildDeadlines(prefs).filter((d) => !d.hidden).length;
      const now = new Date().toISOString();
      const firstRun = lastRun === null;
      lastRun = {
        startedAt: now,
        finishedAt: now,
        ok: true,
        total,
        created: firstRun ? visible : 0,
        updated: 0,
        unchanged: firstRun ? 0 : visible,
        deleted: 0,
        deleteBlocked: 0,
        hidden: total - visible,
        failed: 0,
      };
      return lastRun;
    },
  };
}
