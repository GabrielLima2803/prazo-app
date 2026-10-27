import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/core/api';
import { Pressable, Text } from '@/shared/components';
import { formatTime } from '@/shared/lib/dateFormat';
import { borderWidth, iconSize, opacity, radius, size, spacing, useTheme } from '@/theme';

import { DEADLINE_TYPE_ICONS } from '../constants';
import { timeRange } from '../lib/format';
import { dueOf, isPast } from '../lib/urgency';
import { deadlineHref } from '../navigation';
import { CountdownPill } from './CountdownPill';
import { CourseBadge } from './CourseBadge';

export function DeadlineCard({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  // Entregues continuam com destaque normal; só os encerrados sem entrega esmaecem.
  const faded = !deadline.submitted && isPast(deadline, now);

  return (
    <Pressable
      onPress={() => router.push(deadlineHref(deadline.id))}
      accessibilityRole="button"
      accessibilityLabel={`${deadline.label}: ${deadline.title}, ${deadline.courseCode}, às ${formatTime(dueOf(deadline))}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, faded && styles.faded]}
    >
      <View style={[styles.accent, { backgroundColor: deadline.color }]} />
      <View style={styles.body}>
        <View style={styles.top}>
          <CourseBadge code={deadline.courseCode} color={deadline.color} />
          <CountdownPill deadline={deadline} now={now} />
        </View>
        <Text variant="headline" numberOfLines={2} style={deadline.submitted && styles.done}>
          {deadline.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name={DEADLINE_TYPE_ICONS[deadline.type]} size={iconSize.sm} color={colors.textMuted} />
          <Text variant="caption" tone="muted">
            {deadline.label}
          </Text>
          <View style={[styles.dot, { backgroundColor: colors.textSubtle }]} />
          <Ionicons name="time-outline" size={iconSize.sm} color={colors.textMuted} />
          <Text variant="caption" tone="muted">
            {timeRange(deadline)}
          </Text>
          {deadline.submitted && <Ionicons name="checkmark-circle" size={iconSize.md} color={colors.success} style={styles.check} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: radius.lg, borderWidth: borderWidth.hairline, overflow: 'hidden' },
  faded: { opacity: opacity.inactive },
  accent: { width: size.accentBar },
  body: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xsm },
  dot: { width: size.separatorDot, height: size.separatorDot, borderRadius: radius.pill, marginHorizontal: spacing.xxs },
  done: { textDecorationLine: 'line-through' },
  check: { marginLeft: 'auto' },
});
