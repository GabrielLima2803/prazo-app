import { useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type Palette } from './colors';

export function useTheme(): { colors: Palette; scheme: ColorScheme } {
  const scheme: ColorScheme = useColorScheme() === 'light' ? 'light' : 'dark';
  return { colors: palettes[scheme], scheme };
}
