import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/core/api';
import { Segmented } from '@/shared/components';
import { spacing } from '@/theme';

import { FILTER_OPTIONS } from '../constants';
import type { DeadlineFilter, DeadlineStats } from '../types';
import { DeadlineStatsRow } from './DeadlineStatsRow';
import { Greeting } from './Greeting';
import { NextUpCard } from './NextUpCard';

interface Props {
  now: number;
  nextUp: Deadline | undefined;
  stats: DeadlineStats;
  filter: DeadlineFilter;
  onFilterChange(f: DeadlineFilter): void;
  /** Avisos opcionais entre a saudação e o destaque. */
  banner?: ReactNode;
}

export function DeadlinesHeader({ now, nextUp, stats, filter, onFilterChange, banner }: Props) {
  return (
    <View style={styles.container}>
      <Greeting now={now} />
      {banner}
      {nextUp && <NextUpCard deadline={nextUp} now={now} />}
      <DeadlineStatsRow stats={stats} />
      <Segmented<DeadlineFilter> value={filter} onChange={onFilterChange} options={FILTER_OPTIONS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, paddingBottom: spacing.sm },
});
