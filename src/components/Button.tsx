import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: Props) {
  const { colors } = useTheme();
  const inactive = disabled || loading;
  const fg = variant === 'primary' ? colors.primaryText : variant === 'secondary' ? colors.text : colors.primary;

  const content = (
    <View style={styles.row}>
      {loading ? <ActivityIndicator color={fg} /> : icon && <Ionicons name={icon} size={18} color={fg} />}
      <Text variant="bodyStrong" color={fg}>
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[{ opacity: inactive ? 0.6 : 1, borderRadius: radius.md, overflow: 'hidden' }, style]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.body}>
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.body,
            variant === 'secondary' && { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
          ]}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { paddingVertical: 14, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
