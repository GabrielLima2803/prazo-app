import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { borderWidth, fonts, fontSize, iconSize, radius, spacing, useTheme } from '@/theme';

import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props extends TextInputProps {
  label: string;
  hint?: string;
  /** Campo de senha com botão de mostrar/ocultar. */
  secret?: boolean;
}

export function Field({ label, hint, secret, style, onFocus, onBlur, ...props }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={styles.container}>
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
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
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
            <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={iconSize.xl} color={colors.textMuted} />
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
  container: { gap: spacing.xsm },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: borderWidth.hairline, borderRadius: radius.md },
  input: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontFamily: fonts.medium, fontSize: fontSize.md },
  eye: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
