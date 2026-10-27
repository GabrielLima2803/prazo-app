import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/shared/components';
import { radius, size, spacing, useTheme } from '@/theme';

import { ICAL_EXPORT_STEPS } from '../constants';

/** Passo a passo para copiar a URL de exportação do calendário no Moodle. */
export function ICalSteps() {
  const { colors } = useTheme();
  return (
    <Card style={styles.card}>
      <Text variant="bodyStrong">Como pegar a URL</Text>
      {ICAL_EXPORT_STEPS.map((step, i) => (
        <View key={step} style={styles.step}>
          <View style={[styles.number, { backgroundColor: colors.primarySoft }]}>
            <Text variant="caption" tone="primary">
              {i + 1}
            </Text>
          </View>
          <Text variant="caption" tone="muted" style={styles.text}>
            {step}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  number: {
    width: size.stepBadge,
    height: size.stepBadge,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});
