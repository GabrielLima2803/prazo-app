// Espelha internal/api/types.go do prazo-sync.

export type DeadlineType = 'assign' | 'exam' | 'quiz' | 'forum' | 'course_event' | 'other';

export interface Deadline {
  id: string;
  courseCode: string;
  courseName: string;
  type: DeadlineType;
  label: string;
  phase: string;
  title: string;
  displayTitle: string;
  description: string;
  url: string;
  startsAt: string;
  endsAt: string;
  instant: boolean;
  submitted: boolean;
  colorId: string;
  color: string;
  reminders: number[];
  hidden: boolean;
}

export interface DeadlineList {
  deadlines: Deadline[];
  fetchedAt: string;
}

export interface Course {
  code: string;
  name: string;
  colorId: string;
  color: string;
  hidden: boolean;
  total: number;
  pending: number;
  nextDue: string | null;
}

export interface Run {
  startedAt: string;
  finishedAt: string;
  ok: boolean;
  error?: string;
  total: number;
  created: number;
  updated: number;
  hidden: number;
  failed: number;
}

export interface Status {
  now: string;
  google: { authorized: boolean; calendarName: string };
  lastRun: Run | null;
  nextRun: string | null;
}

export interface Meta {
  palette: { id: string; hex: string }[];
  types: { id: DeadlineType; label: string; defaultReminders: number[] }[];
}

export interface Preferences {
  hiddenCourses: string[];
  hiddenTypes: DeadlineType[];
  courseColors: Record<string, string>;
  reminders: Partial<Record<DeadlineType, number[]>>;
}

export type MoodleMethod = 'login' | 'ical' | 'env';

export interface MoodleStatus {
  connected: boolean;
  method?: MoodleMethod;
  baseUrl?: string;
  fullName?: string;
  siteName?: string;
  connectedAt?: string;
  events?: number;
}

export interface MoodleLogin {
  baseUrl: string;
  username: string;
  password: string;
}

export interface PrazoApi {
  status(): Promise<Status>;
  meta(): Promise<Meta>;
  deadlines(refresh?: boolean): Promise<DeadlineList>;
  courses(): Promise<Course[]>;
  preferences(): Promise<Preferences>;
  savePreferences(p: Preferences): Promise<Preferences>;
  sync(): Promise<Run>;
  moodle(): Promise<MoodleStatus>;
  moodleLogin(req: MoodleLogin): Promise<MoodleStatus>;
  moodleICal(icalUrl: string): Promise<MoodleStatus>;
  moodleDisconnect(): Promise<MoodleStatus>;
}
