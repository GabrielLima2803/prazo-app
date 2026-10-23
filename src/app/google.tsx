import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConnectGoogle, useMoodle, useStatus } from '@/api/hooks';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { Text } from '@/components/Text';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const BENEFITS = [
  ['color-palette-outline', 'Uma cor por disciplina'],
  ['notifications-outline', 'Lembretes antes de cada entrega e prova'],
  ['sync-outline', 'Atualiza sozinho quando o Moodle muda'],
] as const;

/** Segundo passo da entrada: levar os prazos para o Google Agenda. */
export default function GoogleOnboarding() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const moodle = useMoodle();
  const status = useStatus();
  const connect = useConnectGoogle();

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const firstName = moodle.data?.fullName?.split(' ')[0];
  const available = status.data?.google.appAuth ?? true;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.progress}>
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
        <View style={[styles.bar, { backgroundColor: colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </View>

      <View style={{ gap: spacing.sm, alignItems: 'center' }}>
        <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name="calendar" size={36} color={colors.primary} />
        </View>
        <Text variant="caption" tone="success">
          ✓ Moodle conectado{firstName ? ` · olá, ${firstName}!` : ''}
        </Text>
        <Text variant="display" style={{ textAlign: 'center' }}>
          Agora o Google Agenda
        </Text>
        <Text tone="muted" style={{ textAlign: 'center', maxWidth: 320 }}>
          O Prazo cria uma agenda só dele, “Prazo — UDESC”, e não mexe em mais nada da sua conta.
        </Text>
      </View>

      <View style={{ gap: spacing.md }}>
        {BENEFITS.map(([icon, text]) => (
          <View key={text} style={styles.benefit}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.surfaceRaised }]}>
              <Ionicons name={icon} size={18} color={colors.primary} />
            </View>
            <Text variant="bodyStrong">{text}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm }}>
        {!available && <Notice tone="info" message="O servidor ainda não está configurado para conectar o Google pelo app." />}
        {connect.error && <Notice tone="danger" message={connect.error.message} />}
        <Button
          label={connect.isPending ? 'Aguardando o Google…' : 'Conectar Google Agenda'}
          icon="logo-google"
          loading={connect.isPending}
          disabled={!available}
          onPress={() =>
            connect.mutate(undefined, {
              onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                done();
              },
            })
          }
        />
        <Button label="Agora não" variant="ghost" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  progress: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  bar: { width: 28, height: 3, borderRadius: 2 },
  icon: { width: 80, height: 80, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  benefitIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
