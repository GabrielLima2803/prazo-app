import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';

export function useDeadlines() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.deadlines(scope), queryFn: () => api.deadlines() });
}

/** Puxa o Moodle de novo, ignorando o cache do servidor (pull-to-refresh). */
export function useRefreshDeadlines() {
  const { api, scope } = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.deadlines(true),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.deadlines(scope), data);
      qc.invalidateQueries({ queryKey: queryKeys.courses(scope) });
    },
  });
}

export function useDeadline(id: string | undefined) {
  const query = useDeadlines();
  return { ...query, deadline: query.data?.deadlines.find((d) => d.id === id) };
}
