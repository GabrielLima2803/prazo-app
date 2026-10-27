import { StyleSheet, View } from 'react-native';

import type { Status } from '@/core/api';
import { deleteBlockedMessage, eventsInCalendar, syncSummary, useSyncNow } from '@/features/sync';
import { Button, InlineStat, Notice } from '@/shared/components';
import { relative } from '@/shared/lib/dateFormat';
import { haptics } from '@/shared/lib/haptics';
import { radius, spacing, useTheme } from '@/theme';

const EMPTY_VALUE = '—';

/** Última/próxima sincronização, resultado e o botão "Sincronizar agora". */
export function SyncPanel({ status, now }: { status: Status | undefined; now: number }) {
  const { colors } = useTheme();
  const sync = useSyncNow();
  const last = status?.lastRun;
  const syncError = sync.error?.message ?? (last && !last.ok ? last.error : undefined);
  const inCalendar = eventsInCalendar(last);

  const runSync = () =>
    sync.mutate(undefined, {
      onSuccess: (r) => (r.ok ? haptics.success() : haptics.error()),
      onError: () => haptics.error(),
    });

  return (
    <>
      <View style={[styles.stats, { backgroundColor: colors.surfaceRaised }]}>
        <InlineStat label="Última" value={last ? relative(new Date(last.finishedAt), now) : EMPTY_VALUE} />
        <InlineStat label="Próxima" value={status?.nextRun ? relative(new Date(status.nextRun), now) : EMPTY_VALUE} />
        <InlineStat label="Na agenda" value={inCalendar === null ? EMPTY_VALUE : String(inCalendar)} />
      </View>
      {syncError && <Notice tone="danger" message={syncError} />}
      {sync.data?.ok && !sync.isPending && <Notice tone="success" message={syncSummary(sync.data)} />}
      {last && last.deleteBlocked > 0 && <Notice tone="info" message={deleteBlockedMessage(last.deleteBlocked)} />}
      <Button label={sync.isPending ? 'Sincronizando…' : 'Sincronizar agora'} icon="sync" loading={sync.isPending} onPress={runSync} />
    </>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.md, gap: spacing.md },
});
