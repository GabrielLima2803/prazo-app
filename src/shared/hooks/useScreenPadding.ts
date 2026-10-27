import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

/** Padding padrão das telas com rolagem, já somando a área segura do topo. */
export function useScreenPadding() {
  const insets = useSafeAreaInsets();
  return { padding: spacing.lg, paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxl };
}
