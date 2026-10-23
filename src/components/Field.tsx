import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props extends TextInputProps {
  label: string;
  hint?: string;
  /** Campo de senha com botão de mostrar/ocultar. */
  secret?: boolean;
}

export function Field({ label, hint, secret, style, ...props }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <View style={[styles.box, { backgroundColor: colors.surface, borderColor: focused ? colors.primary : colors.border }]}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={secret && !revealed}
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[styles.input, { color: colors.text }, style]}
        />
        {secret && (
          <Pressable
            onPress={() => setRevealed((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Ocultar senha' : 'Mostrar senha'}
            style={styles.eye}
          >
            <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {hint && (
        <Text variant="caption" tone="subtle">
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.md },
  input: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: 13, fontFamily: fonts.medium, fontSize: 15 },
  eye: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
