import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/shared/types/icons';
import { borderWidth, gradientDirection, iconSize, opacity, radius, spacing, useTheme, type Palette } from '@/theme';

import { Pressable } from './Pressable';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

function foreground(variant: Variant, colors: Palette): string {
  if (variant === 'primary') return colors.primaryText;
  if (variant === 'secondary') return colors.text;
  return colors.primary;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style }: Props) {
  const { colors } = useTheme();
  const inactive = disabled || loading;
  const fg = foreground(variant, colors);

  const content = (
    <View style={styles.row}>
      {loading ? <ActivityIndicator color={fg} /> : icon && <Ionicons name={icon} size={iconSize.lg} color={fg} />}
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
      style={[styles.container, inactive && styles.inactive, style]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={colors.gradient} {...gradientDirection} style={styles.body}>
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.body,
            variant === 'secondary' && {
              backgroundColor: colors.surfaceRaised,
              borderWidth: borderWidth.hairline,
              borderColor: colors.border,
            },
          ]}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.md, overflow: 'hidden' },
  inactive: { opacity: opacity.inactive },
  body: { paddingVertical: spacing.mdl, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
