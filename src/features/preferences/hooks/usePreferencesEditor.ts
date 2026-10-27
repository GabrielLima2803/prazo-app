import { useCallback } from 'react';

import type { Preferences } from '@/core/api';

import { usePreferences, useSavePreferences } from '../api';

type Updater = (current: Preferences) => Preferences;

/** Preferências atuais e um update(fn) que aplica uma transformação e salva. */
export function usePreferencesEditor() {
  const query = usePreferences();
  const save = useSavePreferences();
  const current = query.data;
  const { mutate } = save;

  const update = useCallback(
    (fn: Updater) => {
      if (current) mutate(fn(current));
    },
    [current, mutate],
  );

  return { query, prefs: current, update, saving: save.isPending };
}
