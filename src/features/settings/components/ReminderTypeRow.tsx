import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { DeadlineTypeInfo } from '@/core/api';
import { DEADLINE_TYPE_ICONS } from '@/features/deadlines';
import { MAX_REMINDERS_PER_EVENT, REMINDER_OPTIONS } from '@/features/preferences';
import { Chip, Text } from '@/shared/components';
import { formatReminderShort } from '@/shared/lib/duration';
import { iconSize, spacing, useTheme } from '@/theme';

interface Props {
  type: DeadlineTypeInfo;
  active: number[];
  customized: boolean;
  onToggle(minutes: number): void;
  onReset(): void;
}

/** Um tipo de prazo com as antecedências que viram lembretes no Google. */
export function ReminderTypeRow({ type, active, customized, onToggle, onReset }: Props) {
  const { colors } = useTheme();
  const full = active.length >= MAX_REMINDERS_PER_EVENT;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={DEADLINE_TYPE_ICONS[type.id]} size={iconSize.lg} color={colors.textMuted} />
        <Text variant="bodyStrong" style={styles.label}>
          {type.label}
        </Text>
        {customized && (
          <Text variant="caption" tone="primary" onPress={onReset} accessibilityRole="button">
            Padrão
          </Text>
        )}
      </View>
      <View style={styles.chips}>
        {REMINDER_OPTIONS.map((minutes) => {
          const selected = active.includes(minutes);
          return (
            <Chip
              key={minutes}
              label={formatReminderShort(minutes)}
              selected={selected}
              disabled={!selected && full}
              onPress={() => onToggle(minutes)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
