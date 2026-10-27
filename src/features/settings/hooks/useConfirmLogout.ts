import { Alert, Platform } from 'react-native';

import { useConnection } from '@/core/session';

const LOGOUT_TITLE = 'Sair';
const LOGOUT_MESSAGE = 'A sua agenda continua sendo atualizada. Para voltar, é só entrar com o Moodle de novo.';

/** Sair encerra só a sessão deste aparelho: a agenda continua sincronizando. */
export function useConfirmLogout() {
  const { disconnect } = useConnection();
  return () => {
    // Alert.alert com botões não existe no react-native-web.
    if (Platform.OS === 'web') return void disconnect();
    Alert.alert(LOGOUT_TITLE, LOGOUT_MESSAGE, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => disconnect() },
    ]);
  };
}
