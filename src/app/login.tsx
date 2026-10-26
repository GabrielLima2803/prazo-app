import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError, createAuthApi } from '@/api/client';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Notice } from '@/components/Notice';
import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';
import { DEFAULT_SERVER } from '@/lib/config';
import { useConnection, type LogoutReason } from '@/state/connection';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Cada centro da UDESC tem o próprio Moodle (ver docs/moodle-udesc.md no servidor).
const INSTANCES = [
  { id: 'cct', label: 'CCT Joinville', url: 'https://moodle.joinville.udesc.br' },
  { id: 'geral', label: 'UDESC geral', url: 'https://www.moodle.udesc.br' },
  { id: 'outro', label: 'Outro', url: '' },
] as const;

const ERRORS: Record<string, string> = {
  invalid_login: 'Usuário ou senha incorretos.',
  moodle_auth_down: 'O login do Moodle da UDESC está fora do ar agora. Não é a sua senha — tente de novo mais tarde.',
  host_not_allowed: 'Este Moodle ainda não é atendido pelo Prazo.',
  too_many_users: 'O Prazo atingiu o limite de usuários. Fale com quem te convidou.',
  too_many_attempts: 'Muitas tentativas. Espere um minuto e tente de novo.',
  export_unavailable: 'Este Moodle não libera o calendário pelo login. Use “Entro pelo id.udesc”.',
  service_unavailable: 'O login pelo app está desativado neste Moodle. Use “Entro pelo id.udesc”.',
  not_icalendar: 'Essa URL não devolveu um calendário. Gere de novo em Calendário → Exportar.',
  invalid_url: 'Endereço inválido.',
  empty_feed: 'O calendário veio vazio. Confira se é a conta certa.',
  moodle_unreachable: 'Não foi possível falar com o Moodle agora. Tente de novo em instantes.',
};

const REASONS: Record<LogoutReason, string> = {
  moodle_reauth: 'Sua senha do Moodle mudou. Entre de novo para continuar sincronizando — suas preferências estão salvas.',
  session_expired: 'Sua sessão terminou. Entre de novo.',
};

type Mode = 'login' | 'ical';

export default function LoginScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { connect, logoutReason } = useConnection();
  const scroll = useRef<ScrollViewInstance>(null);
  // Leva o campo focado para cima do teclado (o Android com edge-to-edge não
  // redimensiona a tela sozinho).
  const revealBottom = () => setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 250);
  const [mode, setMode] = useState<Mode>('login');
  const [instance, setInstance] = useState<(typeof INSTANCES)[number]['id']>('cct');
  const [customUrl, setCustomUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [icalUrl, setIcalUrl] = useState('');
  const [server, setServer] = useState(DEFAULT_SERVER);
  const [editingServer, setEditingServer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = instance === 'outro' ? customUrl : INSTANCES.find((i) => i.id === instance)!.url;
  const canSubmit = mode === 'login' ? baseUrl.trim() !== '' && username.trim() !== '' && password !== '' : icalUrl.trim() !== '';

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = createAuthApi(server.trim());
      const res = mode === 'login' ? await auth.login({ baseUrl, username, password }) : await auth.loginICal(icalUrl.trim());
      setPassword('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await connect({ mode: 'server', baseUrl: server.trim(), token: res.token });
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(e instanceof ApiError && e.code && ERRORS[e.code] ? ERRORS[e.code]! : e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        ref={scroll}
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logo}>
            <Ionicons name="hourglass" size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text variant="display" style={{ textAlign: 'center' }}>
            Prazo
          </Text>
          <Text tone="muted" style={{ textAlign: 'center', maxWidth: 300 }}>
            {mode === 'login'
              ? 'Entre com a sua conta do Moodle. A senha é usada só agora e não fica salva.'
              : 'Para quem entra pelo id.udesc / Office 365: cole a URL de exportação do calendário.'}
          </Text>
        </View>

        {mode === 'login' ? (
          <View style={{ gap: spacing.lg }}>
            <View style={styles.instances} accessibilityRole="radiogroup">
              {INSTANCES.map((i) => {
                const selected = i.id === instance;
                return (
                  <Pressable
                    key={i.id}
                    onPress={() => setInstance(i.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[
                      styles.instance,
                      { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primarySoft : colors.surface },
                    ]}
                  >
                    <Text variant="caption" tone={selected ? 'primary' : 'muted'} numberOfLines={1}>
                      {i.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {instance === 'outro' && (
              <Field label="Endereço do Moodle" value={customUrl} onChangeText={setCustomUrl} placeholder="https://moodle.exemplo.udesc.br" keyboardType="url" />
            )}
            <Field
              label="Usuário"
              value={username}
              onChangeText={setUsername}
              placeholder="CPF ou usuário do Moodle"
              textContentType="username"
              autoComplete="username"
              onFocus={revealBottom}
            />
            <Field
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Senha do Moodle"
              secret
              textContentType="password"
              autoComplete="password"
              returnKeyType="go"
              onFocus={revealBottom}
              onSubmitEditing={() => canSubmit && submit()}
            />
          </View>
        ) : (
          <View style={{ gap: spacing.lg }}>
            <Card style={{ gap: spacing.sm }}>
              <Text variant="bodyStrong">Como pegar a URL</Text>
              {['No Moodle, abra Calendário', 'Importar ou exportar calendários → Exportar', '“Todos os eventos” e “Eventos recentes e próximos”', 'Obter URL do calendário e copiar'].map(
                (step, i) => (
                  <View key={step} style={styles.step}>
                    <View style={[styles.stepNum, { backgroundColor: colors.primarySoft }]}>
                      <Text variant="caption" tone="primary">
                        {i + 1}
                      </Text>
                    </View>
                    <Text variant="caption" tone="muted" style={{ flex: 1 }}>
                      {step}
                    </Text>
                  </View>
                ),
              )}
            </Card>
            <Field
              label="URL do calendário"
              value={icalUrl}
              onChangeText={setIcalUrl}
              placeholder="https://moodle…/calendar/export_execute.php?…"
              keyboardType="url"
              hint="Ela funciona como uma senha do seu calendário: só cole aqui."
              onFocus={revealBottom}
            />
          </View>
        )}

        {!error && logoutReason && <Notice tone="info" message={REASONS[logoutReason]} />}
        {error && <Notice tone="danger" message={error} />}

        <View style={{ gap: spacing.sm }}>
          <Button label={mode === 'login' ? 'Entrar com o Moodle' : 'Entrar com o calendário'} icon="log-in-outline" loading={loading} disabled={!canSubmit} onPress={submit} />
          <Button
            label={mode === 'login' ? 'Entro pelo id.udesc / Office 365' : 'Voltar para usuário e senha'}
            variant="ghost"
            icon={mode === 'login' ? 'link-outline' : 'key-outline'}
            onPress={() => {
              setError(null);
              setMode(mode === 'login' ? 'ical' : 'login');
            }}
          />
        </View>

        <View style={{ gap: spacing.md, alignItems: 'center' }}>
          <Text variant="caption" tone="primary" onPress={() => connect({ mode: 'demo' })} accessibilityRole="button">
            Só quero ver como funciona
          </Text>
          {editingServer ? (
            <View style={{ alignSelf: 'stretch' }}>
              <Field label="Servidor do Prazo" value={server} onChangeText={setServer} keyboardType="url" />
            </View>
          ) : (
            <Text variant="caption" tone="subtle" onPress={() => setEditingServer(true)} accessibilityRole="button">
              Servidor: {server.replace(/^https?:\/\//, '')} · alterar
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, gap: spacing.xl, justifyContent: 'center' },
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: { width: 72, height: 72, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  instances: { flexDirection: 'row', gap: spacing.sm },
  instance: { flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderRadius: radius.md, borderWidth: 1 },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
