import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import type { PrazoApi, Status } from '@/core/api';
import { sleep } from '@/shared/lib/time';

import { AUTH_POLL_INTERVAL_MS, AUTH_TIMEOUT_MS, GOOGLE_RETURN_PATH, googleMessages } from '../constants';

/** No navegador (expo web) o retorno seria http, que o servidor recusa. */
function returnUrl(): string | undefined {
  return Platform.OS === 'web' ? undefined : Linking.createURL(GOOGLE_RETURN_PATH);
}

async function openConsent(authUrl: string, returnTo: string | undefined) {
  if (returnTo) await WebBrowser.openAuthSessionAsync(authUrl, returnTo);
  else await WebBrowser.openBrowserAsync(authUrl);
}

/** Consulta o /status até o Google aparecer como autorizado ou o tempo acabar. */
async function waitForAuthorization(api: PrazoApi): Promise<Status> {
  const giveUpAt = Date.now() + AUTH_TIMEOUT_MS;
  while (Date.now() < giveUpAt) {
    const status = await api.status();
    if (status.google.authorized) return status;
    await sleep(AUTH_POLL_INTERVAL_MS);
  }
  throw new Error(googleMessages.timeout);
}

/**
 * Abre o consentimento do Google numa sessão de autenticação do sistema. O
 * Google devolve para o servidor (HTTPS público), que salva o token e manda o
 * navegador de volta ao app. A confirmação vem do /status, não do navegador:
 * o usuário pode fechar a aba antes do redirecionamento.
 */
export async function authorizeGoogle(api: PrazoApi): Promise<Status> {
  const returnTo = returnUrl();
  const { authUrl } = await api.googleAuth(returnTo);
  await openConsent(authUrl, returnTo);
  return waitForAuthorization(api);
}
