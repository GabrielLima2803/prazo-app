import { DEFAULT_SERVER } from './env';

/**
 * Servidor aceito no login: HTTPS sempre. Em desenvolvimento (__DEV__), http
 * também, para testar com o servidor na rede local. Sem TLS, a senha do
 * Moodle e o token da sessão trafegariam em texto puro.
 */
export function isValidServerUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return false;
  }
  if (url.protocol === 'https:') return url.hostname !== '';
  return __DEV__ && url.protocol === 'http:' && url.hostname !== '';
}

/** Servidor diferente do oficial: receberá a senha do Moodle de quem entrar. */
export function isCustomServer(raw: string): boolean {
  return raw.trim().replace(/\/+$/, '') !== DEFAULT_SERVER.replace(/\/+$/, '');
}
