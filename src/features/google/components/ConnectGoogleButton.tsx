import { Button } from '@/shared/components';
import { haptics } from '@/shared/lib/haptics';

import { useConnectGoogle } from '../api';
import { googleMessages } from '../constants';

interface Props {
  connect: ReturnType<typeof useConnectGoogle>;
  disabled?: boolean;
  onConnected?: () => void;
}

/** Botão que abre o consentimento e espera a confirmação do servidor. */
export function ConnectGoogleButton({ connect, disabled, onConnected }: Props) {
  return (
    <Button
      label={connect.isPending ? googleMessages.waiting : googleMessages.connect}
      icon="logo-google"
      loading={connect.isPending}
      disabled={disabled}
      onPress={() =>
        connect.mutate(undefined, {
          onSuccess: () => {
            haptics.success();
            onConnected?.();
          },
        })
      }
    />
  );
}
