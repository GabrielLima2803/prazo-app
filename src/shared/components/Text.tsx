import { Text as RNText, type TextProps } from 'react-native';

import { fixedColors, type, useTheme, type Palette, type TextVariant } from '@/theme';

export type TextTone = 'default' | 'muted' | 'subtle' | 'primary' | 'danger' | 'success' | 'inverse';

interface Props extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  /** Cor explícita; tem prioridade sobre tone. */
  color?: string;
}

function toneColor(tone: TextTone, colors: Palette): string {
  switch (tone) {
    case 'muted':
      return colors.textMuted;
    case 'subtle':
      return colors.textSubtle;
    case 'primary':
      return colors.primary;
    case 'danger':
      return colors.danger;
    case 'success':
      return colors.success;
    case 'inverse':
      return fixedColors.white;
    default:
      return colors.text;
  }
}

export function Text({ variant = 'body', tone = 'default', color, style, ...rest }: Props) {
  const { colors } = useTheme();
  return <RNText style={[type[variant], { color: color ?? toneColor(tone, colors) }, style]} {...rest} />;
}
