import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useConnection } from '@/core/session';
import { Button, Notice, Text } from '@/shared/components';
import { spacing, useTheme } from '@/theme';

import { BrandHeader } from '../components/BrandHeader';
import { ConsentNote } from '../components/ConsentNote';
import { CredentialsForm } from '../components/CredentialsForm';
import { ICalForm } from '../components/ICalForm';
import { ServerSelector } from '../components/ServerSelector';
import { KEYBOARD_SCROLL_DELAY_MS } from '../constants';
import { useLoginForm } from '../hooks/useLoginForm';
import { LOGOUT_REASON_MESSAGES, MODE_COPY } from '../messages';

export function LoginScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { logoutReason } = useConnection();
  const form = useLoginForm();
  const copy = MODE_COPY[form.mode];

  // Leva o campo focado para cima do teclado.
  const scroll = useRef<ScrollViewInstance>(null);
  const revealBottom = () => setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), KEYBOARD_SCROLL_DELAY_MS);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        ref={scroll}
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}
      >
        <BrandHeader intro={copy.intro} />

        {form.mode === 'login' ? (
          <CredentialsForm form={form} onFieldFocus={revealBottom} />
        ) : (
          <ICalForm form={form} onFieldFocus={revealBottom} />
        )}

        {form.error ? (
          <Notice tone="danger" message={form.error} />
        ) : (
          logoutReason && <Notice tone="info" message={LOGOUT_REASON_MESSAGES[logoutReason]} />
        )}

        <View style={styles.actions}>
          <Button label={copy.submit} icon="log-in-outline" loading={form.loading} disabled={!form.canSubmit} onPress={form.submit} />
          <Button label={copy.switchLabel} variant="ghost" icon={copy.switchIcon} onPress={form.toggleMode} />
          <ConsentNote server={form.server} />
        </View>

        <View style={styles.footer}>
          <Text variant="caption" tone="primary" onPress={form.enterDemo} accessibilityRole="button">
            Só quero ver como funciona
          </Text>
          <ServerSelector value={form.server} valid={form.serverValid} onChange={form.setServer} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, gap: spacing.xl, justifyContent: 'center' },
  actions: { gap: spacing.sm },
  footer: { gap: spacing.md, alignItems: 'center' },
});
