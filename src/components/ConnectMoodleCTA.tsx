import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';
import { Text } from './Text';

/** Primeiro passo depois de conectar ao servidor: trazer os prazos do Moodle. */
export function ConnectMoodleCTA() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <View style={[styles.icon, { backgroundColor: 'rgba(249,128,18,0.15)' }]}>
        <Ionicons name="school" size={34} color="#F98012" />
      </View>
      <Text variant="title" style={{ textAlign: 'center' }}>
        Conecte seu Moodle
      </Text>
      <Text tone="muted" style={{ textAlign: 'center', maxWidth: 320 }}>
        Entre com a sua conta do Moodle da UDESC para trazer entregas, provas e questionários do semestre.
      </Text>
      <Button label="Conectar Moodle" icon="log-in-outline" onPress={() => router.push('/moodle')} style={{ alignSelf: 'stretch', marginTop: spacing.lg }} />
      <View style={styles.steps}>
        {[
          ['school-outline', 'Moodle'],
          ['calendar-outline', 'Google Agenda'],
          ['notifications-outline', 'Lembretes'],
        ].map(([icon, label], i) => (
          <View key={label} style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: i === 0 ? colors.primarySoft : colors.surfaceRaised }]}>
              <Ionicons name={icon as 'school-outline'} size={18} color={i === 0 ? colors.primary : colors.textSubtle} />
            </View>
            <Text variant="caption" tone={i === 0 ? 'primary' : 'subtle'}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  icon: { width: 76, height: 76, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  steps: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xxl },
  step: { alignItems: 'center', gap: 6 },
  stepIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
