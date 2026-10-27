import type { ReactNode } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';

import { ApiErrorCode, isApiError } from '@/core/api';
import { useConnection } from '@/core/session';
import { Empty, ErrorState, Loading } from '@/shared/components';
import { useScreenPadding } from '@/shared/hooks/useScreenPadding';
import { spacing, useTheme } from '@/theme';

import { useRefreshDeadlines } from '../api';
import { DaySectionHeader } from '../components/DaySectionHeader';
import { DeadlineCard } from '../components/DeadlineCard';
import { DeadlinesHeader } from '../components/DeadlinesHeader';
import { EMPTY_STATES } from '../constants';
import { useDeadlineFeed } from '../hooks/useDeadlineFeed';

const MOODLE_DISCONNECTED_MESSAGE = 'A conta do Moodle foi desconectada no servidor. Entre de novo.';

function Separator() {
  return <View style={styles.separator} />;
}

/** Lista de prazos. O banner (ex.: aviso do Google) vem de fora para não acoplar features. */
export function DeadlinesScreen({ banner }: { banner?: ReactNode }) {
  const { colors } = useTheme();
  const padding = useScreenPadding();
  const { disconnect } = useConnection();
  const { query, now, filter, setFilter, sections, stats, nextUp } = useDeadlineFeed();
  const refresh = useRefreshDeadlines();

  if (query.isPending) return <Loading />;
  if (isApiError(query.error, ApiErrorCode.MoodleNotConnected))
    return <ErrorState message={MOODLE_DISCONNECTED_MESSAGE} onRetry={disconnect} retryLabel="Entrar de novo" />;
  if (query.error) return <ErrorState message={query.error.message} onRetry={query.refetch} />;

  const empty = EMPTY_STATES[filter];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(d) => d.id}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={padding}
      ListHeaderComponent={
        <DeadlinesHeader now={now} nextUp={nextUp} stats={stats} filter={filter} onFilterChange={setFilter} banner={banner} />
      }
      renderSectionHeader={({ section }) => <DaySectionHeader section={section} />}
      renderItem={({ item }) => <DeadlineCard deadline={item} now={now} />}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={<Empty icon={empty.icon} title={empty.title} message={empty.message} />}
      refreshControl={
        <RefreshControl
          refreshing={refresh.isPending}
          onRefresh={() => refresh.mutate()}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  separator: { height: spacing.sm },
});
