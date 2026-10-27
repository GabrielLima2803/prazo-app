import { StyleSheet, View } from 'react-native';

import { StatTile } from '@/shared/components';
import { spacing, useTheme } from '@/theme';

import type { DeadlineStats } from '../types';

export function DeadlineStatsRow({ stats }: { stats: DeadlineStats }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <StatTile value={stats.today} label="em 24 h" accent={stats.today > 0 ? colors.danger : undefined} />
      <StatTile value={stats.week} label="em 7 dias" accent={stats.week > 0 ? colors.warning : undefined} />
      <StatTile value={stats.semester} label="no semestre" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
});
