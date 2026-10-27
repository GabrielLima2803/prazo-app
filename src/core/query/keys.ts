/**
 * Query keys do React Query. Toda chave começa pelo escopo da conexão, para
 * não misturar dados de servidores (ou da demonstração) diferentes.
 */
export const queryKeys = {
  all: (scope: string) => [scope] as const,
  deadlines: (scope: string) => [scope, 'deadlines'] as const,
  courses: (scope: string) => [scope, 'courses'] as const,
  status: (scope: string) => [scope, 'status'] as const,
  meta: (scope: string) => [scope, 'meta'] as const,
  preferences: (scope: string) => [scope, 'preferences'] as const,
  moodle: (scope: string) => [scope, 'moodle'] as const,
};
