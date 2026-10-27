import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/shared/types/icons';
import { alpha, iconSize, radius, spacing, tint, useTheme, type PaletteColor } from '@/theme';

import { Text } from './Text';

type NoticeTone = 'danger' | 'success' | 'info';

const toneStyle: Record<NoticeTone, { color: PaletteColor; icon: IconName }> = {
  danger: { color: 'danger', icon: 'alert-circle' },
  success: { color: 'success', icon: 'checkmark-circle' },
  info: { color: 'primary', icon: 'information-circle' },
};

/** Faixa de erro, sucesso ou informação. */
export function Notice({ tone, message }: { tone: NoticeTone; message: string }) {
  const { colors } = useTheme();
  const color = colors[toneStyle[tone].color];
  return (
    <View style={[styles.box, { backgroundColor: tint(color, alpha.soft) }]}>
      <Ionicons name={toneStyle[tone].icon} size={iconSize.lg} color={color} />
      <Text variant="caption" color={color} style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', borderRadius: radius.md, padding: spacing.md },
  message: { flex: 1 },
});
