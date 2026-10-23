import { Text as RNText, type TextProps } from 'react-native';

import { type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Variant = keyof typeof type;
type Tone = 'default' | 'muted' | 'subtle' | 'primary' | 'danger' | 'success' | 'inverse';

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
  color?: string;
}

export function Text({ variant = 'body', tone = 'default', color, style, ...rest }: Props) {
  const { colors } = useTheme();
  const tones: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    subtle: colors.textSubtle,
    primary: colors.primary,
    danger: colors.danger,
    success: colors.success,
    inverse: '#FFFFFF',
  };
  return <RNText style={[type[variant], { color: color ?? tones[tone] }, style]} {...rest} />;
}
