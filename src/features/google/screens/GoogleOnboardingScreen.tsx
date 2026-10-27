import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { firstName, useMoodle } from '@/features/account';
import { useStatus } from '@/features/sync';
import { Button, IconBox, Notice, Text } from '@/shared/components';
import { maxTextWidth, spacing, useTheme } from '@/theme';

import { useConnectGoogle } from '../api';
import { BenefitList } from '../components/BenefitList';
import { ConnectGoogleButton } from '../components/ConnectGoogleButton';
import { OnboardingProgress } from '../components/OnboardingProgress';
import { DEFAULT_CALENDAR_NAME, googleMessages } from '../constants';

/** Segundo passo da entrada: levar os prazos para o Google Agenda. */
export function GoogleOnboardingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const moodle = useMoodle();
  const status = useStatus();
  const connect = useConnectGoogle();

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const name = firstName(moodle.data);
  // Enquanto o status carrega, assume disponível para não piscar o aviso.
  const available = status.data?.google.appAuth ?? true;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <OnboardingProgress />

      <View style={styles.intro}>
        <IconBox icon="calendar" size="xl" color={colors.primary} background={colors.primarySoft} style={styles.icon} />
        <Text variant="caption" tone="success">
          ✓ Moodle conectado{name ? ` · olá, ${name}!` : ''}
        </Text>
        <Text variant="display" style={styles.centered}>
          Agora o Google Agenda
        </Text>
        <Text tone="muted" style={[styles.centered, styles.lead]}>
          O Prazo cria uma agenda só dele, “{DEFAULT_CALENDAR_NAME}”, e não mexe em mais nada da sua conta.
        </Text>
      </View>

      <BenefitList />

      <View style={styles.actions}>
        {!available && <Notice tone="info" message={googleMessages.appAuthUnavailable} />}
        {connect.error && <Notice tone="danger" message={connect.error.message} />}
        <ConnectGoogleButton connect={connect} disabled={!available} onConnected={done} />
        <Button label="Agora não" variant="ghost" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  intro: { gap: spacing.sm, alignItems: 'center' },
  icon: { marginBottom: spacing.md },
  centered: { textAlign: 'center' },
  lead: { maxWidth: maxTextWidth.wide },
  actions: { gap: spacing.sm },
});
