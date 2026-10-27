import { StyleSheet, View } from 'react-native';

import type { GoogleStatus } from '@/core/api';
import { ConnectGoogleButton, DEFAULT_CALENDAR_NAME, googleMessages, useConnectGoogle, useDisconnectGoogle } from '@/features/google';
import { useStatus } from '@/features/sync';
import { Card, IconBox, Notice, SectionTitle, Text } from '@/shared/components';
import { alpha, spacing, tint, useTheme } from '@/theme';

import { SyncPanel } from './SyncPanel';

function connectionLabel(google: GoogleStatus | undefined): string {
  if (!google) return 'Verificando…';
  if (google.authorized) return 'Conectado ao Google';
  return google.appAuth ? 'Ainda não conectado' : 'Autorização pelo app não configurada';
}

function NotConnected({ google }: { google: GoogleStatus }) {
  const connect = useConnectGoogle();
  return (
    <>
      <Notice tone="info" message={google.appAuth ? googleMessages.connectHint : googleMessages.appAuthSetup} />
      {connect.error && <Notice tone="danger" message={connect.error.message} />}
      {google.appAuth && <ConnectGoogleButton connect={connect} />}
    </>
  );
}

export function GoogleSection({ now }: { now: number }) {
  const { colors } = useTheme();
  const status = useStatus();
  const disconnect = useDisconnectGoogle();
  const google = status.data?.google;
  const statusColor = google?.authorized ? colors.success : colors.warning;

  return (
    <>
      <SectionTitle title="Google Agenda" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <IconBox icon="calendar" size="md" color={statusColor} background={tint(statusColor, alpha.medium)} />
          <View style={styles.text}>
            <Text variant="headline">{google?.calendarName ?? DEFAULT_CALENDAR_NAME}</Text>
            <Text variant="caption" tone="muted">
              {connectionLabel(google)}
            </Text>
          </View>
          {google?.authorized && google.appAuth && (
            <Text variant="caption" tone="subtle" onPress={() => disconnect.mutate()} accessibilityRole="button">
              Desconectar
            </Text>
          )}
        </View>

        {google && !google.authorized ? <NotConnected google={google} /> : <SyncPanel status={status.data} now={now} />}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1 },
});
