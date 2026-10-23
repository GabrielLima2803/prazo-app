import { radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Pressable } from './Pressable';
import { Text } from './Text';

export function Chip({ label, selected, onPress, disabled }: { label: string; selected: boolean; onPress(): void; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primarySoft : 'transparent',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text variant="caption" tone={selected ? 'primary' : 'muted'}>
        {label}
      </Text>
    </Pressable>
  );
}
