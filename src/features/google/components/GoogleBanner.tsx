import { useRouter } from 'expo-router';

import { Notice, Pressable } from '@/shared/components';
import { useStatus } from '@/features/sync';

import { googleMessages } from '../constants';

/** Aviso na lista de prazos enquanto o Google não está conectado; leva aos Ajustes. */
export function GoogleBanner() {
  const router = useRouter();
  const status = useStatus();
  if (!status.data || status.data.google.authorized) return null;
  return (
    <Pressable onPress={() => router.push('/settings')} accessibilityRole="button">
      <Notice tone="info" message={googleMessages.banner} />
    </Pressable>
  );
}
