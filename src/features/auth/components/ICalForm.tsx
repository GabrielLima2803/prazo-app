import { StyleSheet, View } from 'react-native';

import { Field } from '@/shared/components';
import { spacing } from '@/theme';

import type { LoginForm } from '../hooks/useLoginForm';
import { ICalSteps } from './ICalSteps';

export function ICalForm({ form, onFieldFocus }: { form: LoginForm; onFieldFocus(): void }) {
  return (
    <View style={styles.form}>
      <ICalSteps />
      <Field
        label="URL do calendário"
        value={form.icalUrl}
        onChangeText={form.setIcalUrl}
        placeholder="https://moodle…/calendar/export_execute.php?…"
        keyboardType="url"
        hint="Ela funciona como uma senha do seu calendário: só cole aqui."
        onFocus={onFieldFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
});
