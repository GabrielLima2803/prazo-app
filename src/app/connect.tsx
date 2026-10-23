import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createHttpApi } from '@/api/client';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Notice } from '@/components/Notice';
import { Text } from '@/components/Text';
import { useConnection } from '@/state/connection';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function ConnectScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { connect } = useConnection();
  const [baseUrl, setBaseUrl] = useState('http://192.168.0.14:8080');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const submit = async () => {
    const url = baseUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\/.+/.test(url)) return setError('Informe o endereço com http:// ou https://');
    if (token.trim().length < 32) return setError('O token tem pelo menos 32 caracteres (PRAZO_API_TOKEN).');
    setTesting(true);
    setError(null);
    try {
      await createHttpApi(url, token.trim()).status();
      await connect({ mode: 'server', baseUrl: url, token: token.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setTesting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
            <Ionicons name="hourglass" size={34} color="#FFFFFF" />
          </LinearGradient>
          <Text variant="display" style={{ textAlign: 'center' }}>
            Prazo
          </Text>
          <Text tone="muted" style={{ textAlign: 'center', maxWidth: 300 }}>
            Seus prazos do Moodle da UDESC, organizados e no Google Agenda.
          </Text>
        </View>

        <View style={styles.features}>
          <Feature icon="color-palette-outline" text="Uma cor por disciplina" />
          <Feature icon="notifications-outline" text="Lembretes por tipo de atividade" />
          <Feature icon="sync-outline" text="Sincronização automática" />
        </View>

        <View style={{ gap: spacing.md }}>
          <Field label="Servidor" value={baseUrl} onChangeText={setBaseUrl} placeholder="http://192.168.0.10:8080" keyboardType="url" />
          <Field label="Token da API" value={token} onChangeText={setToken} placeholder="PRAZO_API_TOKEN" secret />
          {error && <Notice tone="danger" message={error} />}
          <Button label="Conectar" icon="arrow-forward" loading={testing} onPress={submit} />
          <Button label="Explorar com dados de exemplo" variant="ghost" icon="flask-outline" onPress={() => connect({ mode: 'demo' })} />
        </View>

        <Text variant="caption" tone="subtle" style={{ textAlign: 'center' }}>
          No computador, rode “prazo serve” e use o endereço que ele mostrar. O celular precisa estar na mesma rede Wi-Fi.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Feature({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.feature}>
      <View style={[styles.featureIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text variant="bodyStrong">{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, gap: spacing.xl, justifyContent: 'center' },
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: { width: 76, height: 76, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  features: { gap: spacing.md },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
