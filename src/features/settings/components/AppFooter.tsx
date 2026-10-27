import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

import { Text } from '@/shared/components';
import { spacing } from '@/theme';

const appVersion = Constants.expoConfig?.version ?? '';

export function AppFooter() {
  return (
    <Text variant="caption" tone="subtle" style={styles.footer}>
      Prazo {appVersion} · feito para a UDESC
    </Text>
  );
}

const styles = StyleSheet.create({
  footer: { textAlign: 'center', marginTop: spacing.xl },
});
