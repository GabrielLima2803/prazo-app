import * as WebBrowser from 'expo-web-browser';
import { StyleSheet } from 'react-native';

import { privacyUrl } from '@/core/session';
import { Text } from '@/shared/components';

/** Aviso de consentimento com o link para a política do servidor escolhido. */
export function ConsentNote({ server }: { server: string }) {
  return (
    <Text variant="caption" tone="subtle" style={styles.note}>
      Ao entrar, você concorda com a{' '}
      <Text
        variant="caption"
        tone="primary"
        accessibilityRole="link"
        onPress={() => WebBrowser.openBrowserAsync(privacyUrl(server))}
      >
        Política de Privacidade e os Termos de Uso
      </Text>
      .
    </Text>
  );
}

const styles = StyleSheet.create({
  note: { textAlign: 'center' },
});
