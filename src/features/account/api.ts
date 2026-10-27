import { useQuery } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';

export function useMoodle() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.moodle(scope), queryFn: () => api.moodle() });
}
