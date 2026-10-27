import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { Text } from './Text';

/** Título grande da tela, com subtítulo opcional. */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.container}>
      <Text variant="display">{title}</Text>
      {subtitle && <Text tone="muted">{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs, marginBottom: spacing.sm },
});
