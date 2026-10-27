import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Field, Text } from '@/shared/components';
import { stripProtocol } from '@/shared/lib/text';

/** Mostra o servidor do Prazo em uso e permite trocá-lo. */
export function ServerSelector({ value, onChange }: { value: string; onChange(v: string): void }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <View style={styles.field}>
        <Field label="Servidor do Prazo" value={value} onChangeText={onChange} keyboardType="url" />
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
  field: { alignSelf: 'stretch' },
});
