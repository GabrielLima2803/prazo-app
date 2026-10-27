import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Preferences } from '@/core/api';
import { queryKeys, useApi } from '@/core/query';

/** Paleta e tipos de prazo: não mudam durante a sessão. */
export function useMeta() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.meta(scope), queryFn: () => api.meta(), staleTime: Infinity });
}

export function usePreferences() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.preferences(scope), queryFn: () => api.preferences() });
}

/** Salva com atualização otimista: a tela muda na hora e volta se falhar. */
export function useSavePreferences() {
  const { api, scope } = useApi();
  const qc = useQueryClient();
  const prefsKey = queryKeys.preferences(scope);
  return useMutation({
    mutationFn: (p: Preferences) => api.savePreferences(p),
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: prefsKey });
      const previous = qc.getQueryData<Preferences>(prefsKey);
      qc.setQueryData(prefsKey, next);
      return { previous };
    },
    onError: (_e, _p, ctx) => ctx?.previous && qc.setQueryData(prefsKey, ctx.previous),
    // Prazos e disciplinas dependem das preferências: recarrega tudo da conexão.
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.all(scope) }),
  });
}
