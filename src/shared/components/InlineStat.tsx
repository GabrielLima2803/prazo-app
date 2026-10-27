import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { Text } from './Text';

/** Rótulo pequeno com um valor em destaque embaixo. */
export function InlineStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View style={styles.container}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="bodyStrong" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.xxs },
});
