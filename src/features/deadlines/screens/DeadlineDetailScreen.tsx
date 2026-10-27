import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Empty, Loading } from '@/shared/components';
import { useNow } from '@/shared/hooks/useNow';
import { size, spacing, useTheme } from '@/theme';

import { useDeadline } from '../api';
import { CountdownCard } from '../components/CountdownCard';
import { DeadlineHero } from '../components/DeadlineHero';
import { DescriptionCard } from '../components/DescriptionCard';
import { ScheduleCard } from '../components/ScheduleCard';
import { DETAIL_TICK_MS } from '../constants';

export function DeadlineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const now = useNow(DETAIL_TICK_MS);
  const { deadline, isPending } = useDeadline(id);

  if (isPending) return <Loading />;
  if (!deadline) return <Empty icon="search-outline" title="Prazo não encontrado" message="Ele pode ter sido removido do Moodle." />;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + size.heroFooterReserve }}>
        <DeadlineHero deadline={deadline} onClose={() => router.back()} />
        <View style={styles.content}>
          <CountdownCard deadline={deadline} now={now} />
          <ScheduleCard deadline={deadline} />
          {deadline.description !== '' && <DescriptionCard description={deadline.description} />}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacing.lg, backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <Button label="Abrir no Moodle" icon="open-outline" onPress={() => Linking.openURL(deadline.url)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
