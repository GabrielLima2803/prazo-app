import { useQuery } from '@tanstack/react-query';

import { queryKeys, useApi } from '@/core/query';

export function useCourses() {
  const { api, scope } = useApi();
  return useQuery({ queryKey: queryKeys.courses(scope), queryFn: () => api.courses() });
}
