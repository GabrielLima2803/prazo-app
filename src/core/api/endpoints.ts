const API_PREFIX = '/api/v1';

export const endpoints = {
  auth: {
    login: '/auth/login',
    ical: '/auth/ical',
    logout: `${API_PREFIX}/auth/logout`,
  },
  status: `${API_PREFIX}/status`,
  meta: `${API_PREFIX}/meta`,
  deadlines: `${API_PREFIX}/deadlines`,
  courses: `${API_PREFIX}/courses`,
  preferences: `${API_PREFIX}/preferences`,
  sync: `${API_PREFIX}/sync`,
  moodle: `${API_PREFIX}/moodle`,
  google: `${API_PREFIX}/google`,
  googleAuth: `${API_PREFIX}/google/auth`,
} as const;

/** Query string que pede ao servidor para ignorar o cache do Moodle. */
export const REFRESH_QUERY = '?refresh=1';
