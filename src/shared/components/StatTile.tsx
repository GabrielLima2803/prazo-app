import { StyleSheet, View } from 'react-native';

import { borderWidth, radius, spacing, tabularNums, useTheme } from '@/theme';

import { Text } from './Text';

export function StatTile({ value, label, accent }: { value: number; label: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="title" color={accent} style={tabularNums}>
        {value}
      </Text>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderWidth: borderWidth.hairline, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xxs },
});
