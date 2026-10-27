import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/shared/components';
import { alpha, iconSize, radius, spacing, tint, useTheme } from '@/theme';

import { URGENCY_META } from '../constants';
import type { Urgency } from '../types';

export function UrgencyTag({ urgency }: { urgency: Urgency }) {
  const { colors } = useTheme();
  const meta = URGENCY_META[urgency];
  const color = colors[meta.color];
  return (
    <View style={[styles.tag, { backgroundColor: tint(color, alpha.medium) }]}>
      <Ionicons name={meta.icon} size={iconSize.xs} color={color} />
      <Text variant="caption" color={color}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xsm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xsm,
  },
});
