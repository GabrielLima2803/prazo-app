import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { useConnectMoodle } from '@/api/hooks';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Notice } from '@/components/Notice';
import { Pressable } from '@/components/Pressable';
import { Text } from '@/components/Text';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

// Cada centro da UDESC tem o próprio Moodle (ver docs/moodle-udesc.md).
const INSTANCES = [
  { id: 'cct', label: 'CCT Joinville', url: 'https://moodle.joinville.udesc.br' },
  { id: 'geral', label: 'UDESC (geral)', url: 'https://www.moodle.udesc.br' },
  { id: 'outro', label: 'Outro', url: '' },
] as const;

const ERRORS: Record<string, string> = {
  invalid_login: 'Usuário ou senha incorretos.',
  export_unavailable: 'Este Moodle não libera o calendário pelo login. Use a opção de colar a URL.',
  service_unavailable: 'O login pelo app está desativado neste Moodle. Use a opção de colar a URL.',
  not_icalendar: 'Essa URL não devolveu um calendário. Gere de novo em Calendário → Exportar.',
  invalid_url: 'Endereço inválido. Ele precisa começar com https://',
  empty_feed: 'O calendário veio vazio. Confira se é a conta certa.',
  moodle_unreachable: 'Não foi possível falar com o Moodle agora. Tente de novo em instantes.',
};

type Mode = 'login' | 'ical';

export default function MoodleScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const connect = useConnectMoodle();
  const [mode, setMode] = useState<Mode>('login');
  const [instance, setInstance] = useState<(typeof INSTANCES)[number]['id']>('cct');
  const [customUrl, setCustomUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [icalUrl, setIcalUrl] = useState('');

  const baseUrl = instance === 'outro' ? customUrl : INSTANCES.find((i) => i.id === instance)!.url;
  const canSubmit = mode === 'login' ? baseUrl.trim() !== '' && username.trim() !== '' && password !== '' : icalUrl.trim() !== '';

  const error = connect.error
    ? (connect.error instanceof ApiError && connect.error.code && ERRORS[connect.error.code]) || connect.error.message
    : null;

  const submit = () =>
    connect.mutate(mode === 'login' ? { kind: 'login', login: { baseUrl, username, password } } : { kind: 'ical', icalUrl }, {
      onSuccess: () => {
        setPassword('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    });

  if (connect.data?.connected) {
    const m = connect.data;
    return (
      <View style={[styles.done, { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={[styles.doneIcon, { backgroundColor: 'rgba(52,211,153,0.14)' }]}>
          <Ionicons name="checkmark" size={40} color={colors.success} />
        </View>
        <Text variant="title" style={{ textAlign: 'center' }}>
          {m.fullName ? `Olá, ${m.fullName.split(' ')[0]}!` : 'Moodle conectado'}
        </Text>
        <Text tone="muted" style={{ textAlign: 'center' }}>
          {m.events ?? 0} eventos encontrados no {m.siteName || 'Moodle'}. A agenda do Google já está sendo atualizada.
        </Text>
        <Button label="Ver meus prazos" icon="arrow-forward" onPress={() => router.back()} style={{ alignSelf: 'stretch', marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl, gap: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar" style={[styles.close, { backgroundColor: colors.surface }]}>
            <Ionicons name="close" size={20} color={colors.text} />
          </Pressable>
        </View>

        <View style={{ gap: spacing.sm }}>
          <View style={[styles.logo, { backgroundColor: 'rgba(249,128,18,0.15)' }]}>
            <Ionicons name="school" size={28} color="#F98012" />
          </View>
          <Text variant="display">Conectar Moodle</Text>
          <Text tone="muted">
            {mode === 'login'
              ? 'Entre com a mesma conta do Moodle. A senha é usada só agora para gerar o acesso ao calendário e não fica salva.'
              : 'Para contas que entram pelo id.udesc / Office 365: cole a URL de exportação do calendário.'}
          </Text>
        </View>

        {mode === 'login' ? (
          <View style={{ gap: spacing.lg }}>
            <View style={{ gap: 6 }}>
              <Text variant="caption" tone="muted">
                Moodle
              </Text>
              <View style={styles.instances}>
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
            </View>
            {instance === 'outro' && (
              <Field label="Endereço do Moodle" value={customUrl} onChangeText={setCustomUrl} placeholder="https://moodle.exemplo.udesc.br" keyboardType="url" />
            )}
            <Field label="Usuário" value={username} onChangeText={setUsername} placeholder="CPF ou usuário do Moodle" textContentType="username" autoComplete="username" />
            <Field
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Senha do Moodle"
              secret
              textContentType="password"
              autoComplete="password"
              onSubmitEditing={() => canSubmit && submit()}
              returnKeyType="go"
            />
          </View>
        ) : (
          <View style={{ gap: spacing.lg }}>
            <Card style={{ gap: spacing.sm }}>
              <Text variant="bodyStrong">Como pegar a URL</Text>
              {['No Moodle, abra Calendário', 'Importar ou exportar calendários → Exportar', '"Todos os eventos" e "Eventos recentes e próximos"', 'Toque em Obter URL do calendário e copie'].map(
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
            />
          </View>
        )}

        {error && <Notice tone="danger" message={error} />}

        <View style={{ gap: spacing.sm }}>
          <Button label={mode === 'login' ? 'Entrar' : 'Conectar calendário'} icon="log-in-outline" loading={connect.isPending} disabled={!canSubmit} onPress={submit} />
          <Button
            label={mode === 'login' ? 'Entro pelo id.udesc / Office 365' : 'Voltar para usuário e senha'}
            variant="ghost"
            icon={mode === 'login' ? 'link-outline' : 'key-outline'}
            onPress={() => {
              connect.reset();
              setMode(mode === 'login' ? 'ical' : 'login');
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end' },
  close: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  instances: { flexDirection: 'row', gap: spacing.sm },
  instance: { flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderRadius: radius.md, borderWidth: 1 },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  doneIcon: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
});
