import { StyleSheet } from 'react-native';

import { borderWidth, opacity, radius, spacing, useTheme } from '@/theme';

import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props {
  label: string;
  selected: boolean;
  onPress(): void;
  disabled?: boolean;
}

export function Chip({ label, selected, onPress, disabled }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      style={[
        styles.chip,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primarySoft : 'transparent',
        },
        disabled && styles.disabled,
      ]}
    >
      <Text variant="caption" tone={selected ? 'primary' : 'muted'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xsm, borderRadius: radius.pill, borderWidth: borderWidth.hairline },
  disabled: { opacity: opacity.disabled },
});
