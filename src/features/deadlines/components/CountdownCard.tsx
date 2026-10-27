import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/core/api';
import { Card, Text } from '@/shared/components';
import { countdown } from '@/shared/lib/dateFormat';
import { tabularNums } from '@/theme';

import { dueOf, isPast, urgency } from '../lib/urgency';
import { UrgencyTag } from './UrgencyTag';

function caption(d: Deadline, now: number): string {
  if (d.submitted) return 'Situação';
  return isPast(d, now) ? 'Encerrado' : 'Faltam';
}

export function CountdownCard({ deadline, now }: { deadline: Deadline; now: number }) {
  return (
    <Card style={styles.card}>
      <View>
        <Text variant="caption" tone="muted">
          {caption(deadline, now)}
        </Text>
        <Text variant="display" style={tabularNums}>
          {deadline.submitted ? 'Entregue ✅' : countdown(dueOf(deadline), now)}
        </Text>
      </View>
      <UrgencyTag urgency={urgency(deadline, now)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
