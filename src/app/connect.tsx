import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
  // Link de pareamento (QR gerado no computador): prazo://connect?url=…&token=…
  const params = useLocalSearchParams<{ url?: string; token?: string }>();
  const [baseUrl, setBaseUrl] = useState(params.url ?? 'https://prazo.tailf38db5.ts.net');
  const [token, setToken] = useState(params.token ?? '');
  const autoSubmitted = useRef(false);
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

  useEffect(() => {
    if (params.url && params.token && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submit();
    }
    // submit lê o estado atual; só deve disparar uma vez, na chegada pelo link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.url, params.token]);

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
          No computador, rode “prazo serve” e leia o QR de pareamento, ou informe o endereço e o token que ele mostrar.
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
