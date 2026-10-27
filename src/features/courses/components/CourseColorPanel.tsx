import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { CalendarColor } from '@/core/api';
import { ColorPicker, Text } from '@/shared/components';
import { iconSize, spacing, useTheme } from '@/theme';

interface Props {
  palette: CalendarColor[];
  value: string;
  onChange(id: string): void;
}

export function CourseColorPanel({ palette, value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.panel, { borderTopColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="color-palette-outline" size={iconSize.md} color={colors.textMuted} />
        <Text variant="caption" tone="muted">
          Cor no Google Agenda
        </Text>
      </View>
      <ColorPicker palette={palette} value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xsm },
});
