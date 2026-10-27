import { StyleSheet } from 'react-native';

import type { Deadline } from '@/core/api';
import { Card } from '@/shared/components';
import { formatFullDate } from '@/shared/lib/dateFormat';
import { formatReminder } from '@/shared/lib/duration';
import { spacing } from '@/theme';

import { timeRange } from '../lib/format';
import { dueOf } from '../lib/urgency';
import { DetailRow } from './DetailRow';

const REMINDER_SEPARATOR = ' · ';
const RANGE_SEPARATOR = ' às ';

/** Data, horário e lembretes do prazo. */
export function ScheduleCard({ deadline }: { deadline: Deadline }) {
  const reminders = deadline.reminders.length ? deadline.reminders.map(formatReminder).join(REMINDER_SEPARATOR) : 'Nenhum';
  return (
    <Card style={styles.card}>
      <DetailRow icon="calendar-outline" label="Data">
        {formatFullDate(dueOf(deadline))}
      </DetailRow>
      <DetailRow icon="time-outline" label="Horário">
        {timeRange(deadline, RANGE_SEPARATOR)}
      </DetailRow>
      <DetailRow icon="notifications-outline" label="Lembretes no Google Agenda">
        {reminders}
      </DetailRow>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
});
