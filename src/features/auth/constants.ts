// Cada centro da UDESC tem o próprio Moodle (ver docs/moodle-udesc.md no servidor).
export const MOODLE_INSTANCES = [
  { id: 'cct', label: 'CCT Joinville', url: 'https://moodle.joinville.udesc.br' },
  { id: 'geral', label: 'UDESC geral', url: 'https://www.moodle.udesc.br' },
  { id: 'outro', label: 'Outro', url: '' },
] as const;

export type MoodleInstanceId = (typeof MOODLE_INSTANCES)[number]['id'];

export const DEFAULT_INSTANCE: MoodleInstanceId = 'cct';
/** Instância em que o usuário digita o endereço. */
export const CUSTOM_INSTANCE: MoodleInstanceId = 'outro';

export type LoginMode = 'login' | 'ical';

export const ICAL_EXPORT_STEPS = [
  'No Moodle, abra Calendário',
  'Importar ou exportar calendários → Exportar',
  '“Todos os eventos” e “Eventos recentes e próximos”',
  'Obter URL do calendário e copiar',
] as const;

/**
 * Espera o teclado abrir antes de rolar até o fim (o Android com edge-to-edge
 * não redimensiona a tela sozinho).
 */
export const KEYBOARD_SCROLL_DELAY_MS = 250;
