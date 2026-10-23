import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDisconnectMoodle, useMeta, useMoodle, usePreferences, useSavePreferences, useStatus, useSyncNow } from '@/api/hooks';
import type { DeadlineType, Preferences } from '@/api/types';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
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
  const disconnectMoodle = useDisconnectMoodle();
  const router = useRouter();

  const confirmMoodleLogout = () => {
    if (Platform.OS === 'web') return void disconnectMoodle.mutate();
    Alert.alert('Sair do Moodle', 'O Prazo para de buscar os seus prazos até você conectar de novo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => disconnectMoodle.mutate() },
    ]);
  };

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

  const confirmDisconnect = () => {
    if (Platform.OS === 'web') return void disconnect();
    Alert.alert('Trocar conexão', 'Você volta para a tela de conexão. As preferências continuam salvas no servidor.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desconectar', style: 'destructive', onPress: disconnect },
    ]);
  };

  const last = status.data?.lastRun;
  const google = status.data?.google;
  const syncError = sync.error?.message ?? (last && !last.ok ? last.error : undefined);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl }}>
      <Text variant="display">Ajustes</Text>

      <SectionTitle title="Moodle" />
      <Card style={{ gap: spacing.lg }}>
        <View style={styles.row}>
          <IconTile icon="school" color={moodle.data?.connected ? '#F98012' : colors.textSubtle} />
          <View style={{ flex: 1 }}>
            <Text variant="headline" numberOfLines={1}>
              {moodle.data?.connected ? (moodle.data.fullName ?? moodle.data.siteName ?? 'Conta conectada') : 'Não conectado'}
            </Text>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {moodle.data?.connected
                ? `${moodle.data.baseUrl?.replace('https://', '') ?? ''}${moodle.data.method === 'ical' ? ' · URL do calendário' : moodle.data.method === 'env' ? ' · configurado no servidor' : ''}`
                : 'Conecte para trazer os seus prazos'}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            label={moodle.data?.connected ? 'Trocar conta' : 'Conectar Moodle'}
            variant={moodle.data?.connected ? 'secondary' : 'primary'}
            icon="log-in-outline"
            onPress={() => router.push('/moodle')}
            style={{ flex: 1 }}
          />
          {moodle.data?.connected && moodle.data.method !== 'env' && (
            <Button label="Sair" variant="ghost" icon="log-out-outline" loading={disconnectMoodle.isPending} onPress={confirmMoodleLogout} />
          )}
        </View>
      </Card>

      <SectionTitle title="Google Agenda" />
      <Card style={{ gap: spacing.lg }}>
        <View style={styles.row}>
          <IconTile icon="calendar" color={google?.authorized ? colors.success : colors.warning} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">{google?.calendarName ?? 'Prazo — UDESC'}</Text>
            <Text variant="caption" tone="muted">
              {google === undefined ? 'Verificando…' : google.authorized ? 'Conectado ao Google' : 'Rode "prazo auth" no servidor'}
            </Text>
          </View>
        </View>

        <View style={[styles.syncInfo, { backgroundColor: colors.surfaceRaised }]}>
          <Stat label="Última" value={last ? relative(new Date(last.finishedAt), now) : '—'} />
          <Stat label="Próxima" value={status.data?.nextRun ? relative(new Date(status.data.nextRun), now) : '—'} />
          <Stat label="Na agenda" value={last?.ok ? String(last.created + last.updated) : '—'} />
        </View>

        {syncError && (
          <View style={[styles.alert, { backgroundColor: 'rgba(248,113,113,0.12)' }]}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text variant="caption" tone="danger" style={{ flex: 1 }}>
              {syncError}
            </Text>
          </View>
        )}
        {sync.data?.ok && !sync.isPending && (
          <View style={[styles.alert, { backgroundColor: 'rgba(52,211,153,0.12)' }]}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text variant="caption" tone="success" style={{ flex: 1 }}>
              {sync.data.created} criado(s), {sync.data.updated} atualizado(s){sync.data.hidden ? `, ${sync.data.hidden} oculto(s)` : ''}.
            </Text>
          </View>
        )}

        <Button label={sync.isPending ? 'Sincronizando…' : 'Sincronizar agora'} icon="sync" loading={sync.isPending} onPress={runSync} />
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

      <SectionTitle title="Conexão" />
      <Card style={{ gap: spacing.lg }}>
        <View style={styles.row}>
          <IconTile icon={connection?.mode === 'demo' ? 'flask' : 'server'} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text variant="headline">{connection?.mode === 'demo' ? 'Modo demonstração' : 'Servidor Prazo'}</Text>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {connection?.mode === 'server' ? connection.baseUrl : 'Dados de exemplo, nada é enviado ao Google'}
            </Text>
          </View>
        </View>
        <Button label="Trocar conexão" variant="secondary" icon="swap-horizontal" onPress={confirmDisconnect} />
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
  alert: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', borderRadius: radius.md, padding: spacing.md },
});
