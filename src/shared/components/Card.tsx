import { View, type ViewProps } from 'react-native';

import { borderWidth, radius, spacing, useTheme } from '@/theme';

export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: borderWidth.hairline,
          borderColor: colors.border,
          padding: spacing.lg,
        },
        style,
      ]}
      {...rest}
    />
  );
}
