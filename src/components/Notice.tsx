import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

/** Faixa de erro, sucesso ou informação. */
export function Notice({ tone, message }: { tone: 'danger' | 'success' | 'info'; message: string }) {
  const { colors } = useTheme();
  const color = tone === 'danger' ? colors.danger : tone === 'success' ? colors.success : colors.primary;
  const icon = tone === 'danger' ? 'alert-circle' : tone === 'success' ? 'checkmark-circle' : 'information-circle';
  return (
    <View style={[styles.box, { backgroundColor: tint(color, 0.12) }]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text variant="caption" color={color} style={{ flex: 1 }}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', borderRadius: radius.md, padding: spacing.md },
});
