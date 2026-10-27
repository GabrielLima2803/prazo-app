import { StyleSheet, View } from 'react-native';

import { Text } from '@/shared/components';
import { formatFullDate, greeting } from '@/shared/lib/dateFormat';
import { spacing } from '@/theme';

export function Greeting({ now }: { now: number }) {
  const date = new Date(now);
  return (
    <View style={styles.container}>
      <Text variant="caption" tone="muted">
        {formatFullDate(date)}
      </Text>
      <Text variant="display">{greeting(date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxs },
});
