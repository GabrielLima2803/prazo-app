import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/api/types';
import { dueOf, formatTime, urgency } from '@/lib/dates';
import { typeIcon } from '@/lib/icons';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { CourseBadge } from './Badge';
import { CountdownPill } from './CountdownPill';
import { Pressable } from './Pressable';
import { Text } from './Text';

export function DeadlineCard({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  const past = urgency(deadline, now) === 'overdue';
  const due = dueOf(deadline);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/deadline/[id]', params: { id: deadline.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${deadline.label}: ${deadline.title}, ${deadline.courseCode}, às ${formatTime(due)}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, opacity: past ? 0.6 : 1 }]}
    >
      <View style={[styles.accent, { backgroundColor: deadline.color }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <CourseBadge code={deadline.courseCode} color={deadline.color} />
          <CountdownPill deadline={deadline} now={now} />
        </View>
        <Text variant="headline" numberOfLines={2} style={deadline.submitted && { textDecorationLine: 'line-through' }}>
          {deadline.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name={typeIcon[deadline.type]} size={15} color={colors.textMuted} />
          <Text variant="caption" tone="muted">
            {deadline.label}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.textSubtle }]} />
          <Ionicons name="time-outline" size={15} color={colors.textMuted} />
          <Text variant="caption" tone="muted">
            {deadline.instant ? `até ${formatTime(due)}` : `${formatTime(new Date(deadline.startsAt))}–${formatTime(due)}`}
          </Text>
          {deadline.submitted && <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginLeft: 'auto' }} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  accent: { width: 4 },
  body: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 2 },
});
