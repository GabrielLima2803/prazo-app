import { StyleSheet } from 'react-native';

import { Card, Text } from '@/shared/components';
import { spacing } from '@/theme';

export function DescriptionCard({ description }: { description: string }) {
  return (
    <Card style={styles.card}>
      <Text variant="overline" tone="muted">
        Descrição
      </Text>
      <Text variant="reading">{description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
});
