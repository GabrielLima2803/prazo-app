import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/core/api';
import { Text } from '@/shared/components';
import { countdown } from '@/shared/lib/dateFormat';
import { alpha, radius, spacing, tint, useTheme } from '@/theme';

import { COUNTDOWN_COLORS, URGENCY_META } from '../constants';
import { dueOf, urgency } from '../lib/urgency';

export function CountdownPill({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const u = urgency(deadline, now);
  const color = colors[COUNTDOWN_COLORS[u]];
  const label = u === 'done' ? URGENCY_META.done.label : countdown(dueOf(deadline), now);
  return (
    <View style={[styles.pill, { backgroundColor: tint(color, alpha.medium) }]}>
      <Text variant="mono" color={color}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { borderRadius: radius.pill, paddingHorizontal: spacing.sml, paddingVertical: spacing.xs },
});
