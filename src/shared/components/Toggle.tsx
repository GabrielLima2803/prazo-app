import { Switch, type SwitchProps } from 'react-native';

import { fixedColors, useTheme } from '@/theme';

// activeThumbColor é a prop equivalente no react-native-web.
const webThumb = { activeThumbColor: fixedColors.white } as object;

/** Switch com as cores do tema. */
export function Toggle(props: SwitchProps) {
  const { colors } = useTheme();
  return <Switch trackColor={{ true: colors.primary, false: colors.border }} thumbColor={fixedColors.white} {...webThumb} {...props} />;
}
