import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import type { ComponentProps, ReactNode } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useConnectGoogle,
  useDisconnectGoogle,
  useMeta,
  useMoodle,
  usePreferences,
  useSavePreferences,
  useStatus,
  useSyncNow,
} from '@/api/hooks';
import type { DeadlineType, Preferences } from '@/api/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Notice } from '@/components/Notice';
import { SectionTitle } from '@/components/SectionTitle';
import { Text } from '@/components/Text';
import { Toggle } from '@/components/Toggle';
import { relative, shortReminder } from '@/lib/dates';
import { typeIcon } from '@/lib/icons';
import { useNow } from '@/lib/useNow';
import { useConnection } from '@/state/connection';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Opções oferecidas para os lembretes; o Google aceita até 5 por evento.
const REMINDER_OPTIONS = [10080, 4320, 1440, 720, 120, 60, 30];
const MAX_REMINDERS = 5;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const now = useNow();
  const { connection, disconnect } = useConnection();
  const status = useStatus();
  const meta = useMeta();
  const prefs = usePreferences();
  const save = useSavePreferences();
  const sync = useSyncNow();
  const moodle = useMoodle();
  const connectGoogle = useConnectGoogle();
  const disconnectGoogle = useDisconnectGoogle();

  const current: Preferences | undefined = prefs.data;
  const update = (patch: Partial<Preferences>) => current && save.mutate({ ...current, ...patch });

  const runSync = () =>
    sync.mutate(undefined, {
      onSuccess: (r) => Haptics.notificationAsync(r.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error),
      onError: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    });

  const toggleReminder = (t: DeadlineType, minutes: number, defaults: number[]) => {
    if (!current) return;
    const active = current.reminders[t] ?? defaults;
    const next = active.includes(minutes) ? active.filter((m) => m !== minutes) : [...active, minutes].sort((a, b) => b - a);
    Haptics.selectionAsync();
    update({ reminders: { ...current.reminders, [t]: next } });
  };

  // Sair encerra só a sessão deste aparelho: a agenda continua sincronizando.
  const confirmLogout = () => {
    if (Platform.OS === 'web') return void disconnect();
    Alert.alert('Sair', 'A sua agenda continua sendo atualizada. Para voltar, é só entrar com o Moodle de novo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: disconnect },
    ]);
  };

  const last = status.data?.lastRun;
  const google = status.data?.google;
  const syncError = sync.error?.message ?? (last && !last.ok ? last.error : undefined);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl }}>
      <Text variant="display">Ajustes</Text>

      <SectionTitle title="Conta" />
      <Card style={{ gap: spacing.lg }}>
        <View style={styles.row}>
          <IconTile icon="school" color="#F98012" />
          <View style={{ flex: 1 }}>
            <Text variant="headline" numberOfLines={1}>
              {connection?.mode === 'demo' ? 'Modo demonstração' : (moodle.data?.fullName ?? moodle.data?.siteName ?? 'Conta do Moodle')}
            </Text>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {connection?.mode === 'demo'
                ? 'Dados de exemplo, nada vai para o Google'
                : `${moodle.data?.baseUrl?.replace('https://', '') ?? 'Moodle'}${moodle.data?.method === 'ical' ? ' · pelo calendário' : ''}`}
            </Text>
          </View>
        </View>
        <Button label={connection?.mode === 'demo' ? 'Sair da demonstração' : 'Sair'} variant="secondary" icon="log-out-outline" onPress={confirmLogout} />
      </Card>

      <SectionTitle title="Google Agenda" />
      <Card style={{ gap: spacing.lg }}>
        <View style={styles.row}>
          <IconTile icon="calendar" color={google?.authorized ? colors.success : colors.warning} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">{google?.calendarName ?? 'Prazo — UDESC'}</Text>
            <Text variant="caption" tone="muted">
              {google === undefined
                ? 'Verificando…'
                : google.authorized
                  ? 'Conectado ao Google'
                  : google.appAuth
                    ? 'Ainda não conectado'
                    : 'Autorização pelo app não configurada'}
            </Text>
          </View>
          {google?.authorized && google.appAuth && (
            <Text variant="caption" tone="subtle" onPress={() => disconnectGoogle.mutate()} accessibilityRole="button">
              Desconectar
            </Text>
          )}
        </View>

        {google && !google.authorized ? (
          <>
            {google.appAuth ? (
              <Notice tone="info" message="Conecte para criar a agenda “Prazo — UDESC” com os seus prazos e lembretes." />
            ) : (
              <Notice tone="info" message="No servidor, configure PRAZO_PUBLIC_URL (Tailscale) e a credencial web, ou rode “prazo auth” no computador." />
            )}
            {connectGoogle.error && <Notice tone="danger" message={connectGoogle.error.message} />}
            {google.appAuth && (
              <Button
                label={connectGoogle.isPending ? 'Aguardando o Google…' : 'Conectar Google Agenda'}
                icon="logo-google"
                loading={connectGoogle.isPending}
                onPress={() =>
                  connectGoogle.mutate(undefined, {
                    onSuccess: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
                  })
                }
              />
            )}
          </>
        ) : (
          <>
            <View style={[styles.syncInfo, { backgroundColor: colors.surfaceRaised }]}>
              <Stat label="Última" value={last ? relative(new Date(last.finishedAt), now) : '—'} />
              <Stat label="Próxima" value={status.data?.nextRun ? relative(new Date(status.data.nextRun), now) : '—'} />
              <Stat label="Na agenda" value={last?.ok ? String(last.created + last.updated) : '—'} />
            </View>
            {syncError && <Notice tone="danger" message={syncError} />}
            {sync.data?.ok && !sync.isPending && (
              <Notice
                tone="success"
                message={`${sync.data.created} criado(s), ${sync.data.updated} atualizado(s)${sync.data.hidden ? `, ${sync.data.hidden} oculto(s)` : ''}.`}
              />
            )}
            <Button label={sync.isPending ? 'Sincronizando…' : 'Sincronizar agora'} icon="sync" loading={sync.isPending} onPress={runSync} />
          </>
        )}
      </Card>

      <SectionTitle title="Lembretes por tipo" trailing={`até ${MAX_REMINDERS} por evento`} />
      <Card style={{ gap: spacing.xl }}>
        {meta.data?.types.map((t) => {
          const active = current?.reminders[t.id] ?? t.defaultReminders;
          return (
            <View key={t.id} style={{ gap: spacing.sm }}>
              <View style={styles.row}>
                <Ionicons name={typeIcon[t.id]} size={18} color={colors.textMuted} />
                <Text variant="bodyStrong" style={{ flex: 1 }}>
                  {t.label}
                </Text>
                {current?.reminders[t.id] && (
                  <Text
                    variant="caption"
                    tone="primary"
                    onPress={() => {
                      const { [t.id]: _, ...rest } = current.reminders;
                      update({ reminders: rest });
                    }}
                  >
                    Padrão
                  </Text>
                )}
              </View>
              <View style={styles.chips}>
                {REMINDER_OPTIONS.map((m) => {
                  const selected = active.includes(m);
                  return (
                    <Chip
                      key={m}
                      label={shortReminder(m)}
                      selected={selected}
                      disabled={!selected && active.length >= MAX_REMINDERS}
                      onPress={() => toggleReminder(t.id, m, t.defaultReminders)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </Card>

      <SectionTitle title="Tipos visíveis" />
      <Card style={{ gap: spacing.md }}>
        {meta.data?.types.map((t) => {
          const shown = !current?.hiddenTypes.includes(t.id);
          return (
            <View key={t.id} style={styles.row}>
              <Ionicons name={typeIcon[t.id]} size={18} color={colors.textMuted} />
              <Text style={{ flex: 1 }}>{t.label}</Text>
              <Toggle
                value={shown}
                onValueChange={(v) =>
                  current &&
                  update({ hiddenTypes: v ? current.hiddenTypes.filter((x) => x !== t.id) : [...current.hiddenTypes, t.id] })
                }
                accessibilityLabel={`Mostrar ${t.label}`}
              />
            </View>
          );
        })}
      </Card>

      <Text variant="caption" tone="subtle" style={{ textAlign: 'center', marginTop: spacing.xl }}>
        Prazo {Constants.expoConfig?.version ?? ''} · feito para a UDESC
      </Text>
    </ScrollView>
  );
}

function IconTile({ icon, color }: { icon: ComponentProps<typeof Ionicons>['name']; color: string }) {
  return (
    <View style={[styles.iconTile, { backgroundColor: `${color}22` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="bodyStrong" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconTile: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  syncInfo: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.md, gap: spacing.md },
});
