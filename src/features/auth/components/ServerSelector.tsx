import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { isCustomServer } from '@/core/config';
import { Field, Notice, Text } from '@/shared/components';
import { stripProtocol } from '@/shared/lib/text';
import { spacing } from '@/theme';

import { CUSTOM_SERVER_WARNING, INVALID_SERVER_MESSAGE } from '../messages';

interface Props {
  value: string;
  valid: boolean;
  onChange(v: string): void;
}

/** Mostra o servidor do Prazo em uso e permite trocá-lo, com aviso. */
export function ServerSelector({ value, valid, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <View style={styles.field}>
        <Field label="Servidor do Prazo" value={value} onChangeText={onChange} keyboardType="url" />
        {!valid && <Notice tone="danger" message={INVALID_SERVER_MESSAGE} />}
        {valid && isCustomServer(value) && <Notice tone="info" message={CUSTOM_SERVER_WARNING} />}
      </View>
    );
  }
  return (
    <Text variant="caption" tone="subtle" onPress={() => setEditing(true)} accessibilityRole="button">
      Servidor: {stripProtocol(value)} · alterar
    </Text>
  );
}

const styles = StyleSheet.create({
  field: { alignSelf: 'stretch', gap: spacing.sm },
});
