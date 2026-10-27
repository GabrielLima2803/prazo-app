import { StyleSheet, View } from 'react-native';

import { Field } from '@/shared/components';
import { spacing } from '@/theme';

import { CUSTOM_INSTANCE } from '../constants';
import type { LoginForm } from '../hooks/useLoginForm';
import { InstancePicker } from './InstancePicker';

export function CredentialsForm({ form, onFieldFocus }: { form: LoginForm; onFieldFocus(): void }) {
  return (
    <View style={styles.form}>
      <InstancePicker value={form.instance} onChange={form.setInstance} />
      {form.instance === CUSTOM_INSTANCE && (
        <Field
          label="Endereço do Moodle"
          value={form.customUrl}
          onChangeText={form.setCustomUrl}
          placeholder="https://moodle.exemplo.udesc.br"
          keyboardType="url"
        />
      )}
      <Field
        label="Usuário"
        value={form.username}
        onChangeText={form.setUsername}
        placeholder="CPF ou usuário do Moodle"
        textContentType="username"
        autoComplete="username"
        onFocus={onFieldFocus}
      />
      <Field
        label="Senha"
        value={form.password}
        onChangeText={form.setPassword}
        placeholder="Senha do Moodle"
        secret
        textContentType="password"
        autoComplete="password"
        returnKeyType="go"
        onFocus={onFieldFocus}
        onSubmitEditing={form.submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
});
