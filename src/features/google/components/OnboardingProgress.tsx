import { StyleSheet, View } from 'react-native';

import { radius, size, spacing, useTheme } from '@/theme';

/** Indicador de passos: Moodle (feito) → Google (atual). */
export function OnboardingProgress() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: colors.success }]} />
      <View style={[styles.bar, { backgroundColor: colors.primary }]} />
      <View style={[styles.dot, { backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: spacing.xsm },
  dot: { width: size.progressDot, height: size.progressDot, borderRadius: radius.pill },
  bar: { width: size.progressBarWidth, height: size.progressBarHeight, borderRadius: radius.xs },
});
