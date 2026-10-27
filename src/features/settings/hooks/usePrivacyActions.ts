import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform, Share } from 'react-native';

import { privacyUrl, serverOf, useConnection } from '@/core/session';
import { useDeleteAccount, useExportAccount } from '@/features/account';
import { DEFAULT_CALENDAR_NAME } from '@/features/google';
import { haptics } from '@/shared/lib/haptics';

const JSON_INDENT = 2;

const DELETE_TITLE = 'Excluir conta e dados';
const DELETE_MESSAGE =
  'Apaga do servidor a sua conta do Moodle, as preferências e o acesso ao Google, e sai de todos os aparelhos. ' +
  `A agenda “${DEFAULT_CALENDAR_NAME}” continua no seu Google: apague por lá se quiser. Não dá para desfazer.`;

/** Ações de LGPD: ler a política, baixar os dados e excluir a conta. */
export function usePrivacyActions() {
  const { connection } = useConnection();
  const exportAccount = useExportAccount();
  const deleteAccount = useDeleteAccount();

  const openPolicy = () => WebBrowser.openBrowserAsync(privacyUrl(serverOf(connection)));

  const shareExport = () =>
    exportAccount.mutate(undefined, {
      onSuccess: (data) => {
        haptics.success();
        Share.share({ title: 'Meus dados no Prazo', message: JSON.stringify(data, null, JSON_INDENT) });
      },
      onError: () => haptics.error(),
    });

  const runDelete = () =>
    deleteAccount.mutate(undefined, {
      onSuccess: () => haptics.success(),
      onError: () => haptics.error(),
    });

  const confirmDelete = () => {
    // Alert.alert com botões não existe no react-native-web.
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`${DELETE_TITLE}?\n\n${DELETE_MESSAGE}`)) runDelete();
      return;
    }
    Alert.alert(DELETE_TITLE, DELETE_MESSAGE, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: runDelete },
    ]);
  };

  return { openPolicy, shareExport, confirmDelete, exportAccount, deleteAccount };
}
