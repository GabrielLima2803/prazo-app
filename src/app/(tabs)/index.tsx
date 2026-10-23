import { useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDeadlines, useRefreshDeadlines } from '@/api/hooks';
import type { Deadline } from '@/api/types';
import { DeadlineCard } from '@/components/DeadlineCard';
import { NextUpCard } from '@/components/NextUpCard';
import { Segmented } from '@/components/Segmented';
import { StatTile } from '@/components/StatTile';
import { Empty, ErrorState, Loading } from '@/components/States';
import { Text } from '@/components/Text';
import { dueOf, formatFullDate, greeting, groupByDay } from '@/lib/dates';
import { useNow } from '@/lib/useNow';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Filter = 'upcoming' | 'past' | 'all';

const DAY = 86_400_000;

export default function DeadlinesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const now = useNow();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const { data, isPending, error, refetch } = useDeadlines();
  const refresh = useRefreshDeadlines();

  const visible = useMemo(() => (data?.deadlines ?? []).filter((d) => !d.hidden), [data]);
  const upcoming = useMemo(() => visible.filter((d) => dueOf(d).getTime() >= now), [visible, now]);
  const nextUp = upcoming.find((d) => !d.submitted);

  const sections = useMemo(() => {
    const byFilter: Record<Filter, Deadline[]> = {
      upcoming: upcoming.filter((d) => d !== nextUp),
      past: visible.filter((d) => dueOf(d).getTime() < now).reverse(),
      all: visible,
    };
    return groupByDay(byFilter[filter], now);
  }, [filter, upcoming, visible, nextUp, now]);

  const stats = {
    today: upcoming.filter((d) => dueOf(d).getTime() - now < DAY).length,
    week: upcoming.filter((d) => dueOf(d).getTime() - now < 7 * DAY).length,
    semester: upcoming.length,
  };

  if (isPending) return <Loading />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const header = (
    <View style={{ gap: spacing.lg, paddingBottom: spacing.sm }}>
      <View style={{ gap: 2 }}>
        <Text variant="caption" tone="muted">
          {formatFullDate(new Date(now))}
        </Text>
        <Text variant="display">{greeting(new Date(now))} 👋</Text>
      </View>
      {nextUp && <NextUpCard deadline={nextUp} now={now} />}
      <View style={styles.stats}>
        <StatTile value={stats.today} label="em 24 h" accent={stats.today > 0 ? colors.danger : undefined} />
        <StatTile value={stats.week} label="em 7 dias" accent={stats.week > 0 ? colors.warning : undefined} />
        <StatTile value={stats.semester} label="no semestre" />
      </View>
      <Segmented<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'upcoming', label: 'Próximos' },
          { value: 'past', label: 'Passados' },
          { value: 'all', label: 'Todos' },
        ]}
      />
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(d) => d.id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl }}
      ListHeaderComponent={header}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text variant="overline" tone="muted">
            {section.title}
          </Text>
          <Text variant="caption" tone="subtle">
            {section.data.length}
          </Text>
        </View>
      )}
      renderItem={({ item }) => <DeadlineCard deadline={item} now={now} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      ListEmptyComponent={
        <Empty
          icon={filter === 'past' ? 'archive-outline' : 'sparkles-outline'}
          title={filter === 'past' ? 'Nada por aqui' : 'Tudo em dia'}
          message={filter === 'past' ? 'Os prazos que já passaram aparecem aqui.' : 'Nenhum outro prazo pela frente. Aproveite!'}
        />
      }
      refreshControl={
        <RefreshControl refreshing={refresh.isPending} onRefresh={() => refresh.mutate()} tintColor={colors.primary} colors={[colors.primary]} />
      }
    />
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.xl, paddingBottom: spacing.sm },
});
