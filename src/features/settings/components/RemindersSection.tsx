import { StyleSheet } from 'react-native';

import {
  activeReminders,
  hasCustomReminders,
  MAX_REMINDERS_PER_EVENT,
  resetReminders,
  toggleReminder,
  useMeta,
  usePreferencesEditor,
} from '@/features/preferences';
import { Card, SectionTitle } from '@/shared/components';
import { haptics } from '@/shared/lib/haptics';
import { spacing } from '@/theme';

import { ReminderTypeRow } from './ReminderTypeRow';

export function RemindersSection() {
  const meta = useMeta();
  const { prefs, update } = usePreferencesEditor();

  return (
    <>
      <SectionTitle title="Lembretes por tipo" trailing={`até ${MAX_REMINDERS_PER_EVENT} por evento`} />
      <Card style={styles.card}>
        {meta.data?.types.map((type) => (
          <ReminderTypeRow
            key={type.id}
            type={type}
            active={prefs ? activeReminders(prefs, type) : type.defaultReminders}
            customized={prefs ? hasCustomReminders(prefs, type.id) : false}
            onToggle={(minutes) => {
              haptics.selection();
              update((p) => toggleReminder(p, type, minutes));
            }}
            onReset={() => update((p) => resetReminders(p, type.id))}
          />
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xl },
});
