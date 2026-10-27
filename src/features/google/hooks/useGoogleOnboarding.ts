import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useConnection } from '@/core/session';
import { useStatus } from '@/features/sync';

/** Logo depois do login, abre o passo do Google (só se ainda não estiver conectado). */
export function useGoogleOnboarding() {
  const router = useRouter();
  const { onboarding, finishOnboarding } = useConnection();
  const status = useStatus();

  useEffect(() => {
    if (!onboarding || !status.data) return;
    finishOnboarding();
    if (!status.data.google.authorized) router.push('/google');
  }, [onboarding, status.data, finishOnboarding, router]);
}
