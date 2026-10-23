import { Switch, type SwitchProps } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/** Switch com as cores do tema; activeThumbColor é a prop do react-native-web. */
export function Toggle(props: SwitchProps) {
  const { colors } = useTheme();
  const web = { activeThumbColor: '#FFFFFF' } as object;
  return <Switch trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#FFFFFF" {...web} {...props} />;
}
