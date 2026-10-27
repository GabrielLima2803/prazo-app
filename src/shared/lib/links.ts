import { Linking } from 'react-native';

const SAFE_PROTOCOLS = new Set(['https:', 'http:']);

/** URLs vindas de fora (Moodle, servidor) só abrem se forem http(s). */
export function isSafeExternalUrl(raw: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(new URL(raw).protocol);
  } catch {
    return false;
  }
}

/**
 * Abre no navegador do sistema. Recusa outros esquemas (javascript:,
 * intent:, file:, deep links de outros apps) que um evento malicioso no
 * Moodle poderia trazer.
 */
export async function openExternalUrl(raw: string): Promise<boolean> {
  if (!isSafeExternalUrl(raw)) return false;
  await Linking.openURL(raw);
  return true;
}
