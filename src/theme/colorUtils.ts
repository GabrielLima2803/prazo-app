import type { ColorScheme } from './colors';

const HEX_RADIX = 16;
const CHANNEL_MAX = 255;
const RED_SHIFT = 16;
const GREEN_SHIFT = 8;

/** Quanto as cores claras escurecem para continuar legíveis no tema claro. */
const LIGHT_THEME_DARKEN_FACTOR = 0.62;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.replace('#', ''), HEX_RADIX);
  return { r: (n >> RED_SHIFT) & CHANNEL_MAX, g: (n >> GREEN_SHIFT) & CHANNEL_MAX, b: n & CHANNEL_MAX };
}

function channelToHex(value: number): string {
  return Math.round(value).toString(HEX_RADIX).padStart(2, '0');
}

/** Mistura uma cor hex com transparência: tint("#039BE5", alpha.soft). */
export function tint(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Cor de texto legível sobre fundo claro: escurece as cores da paleta do
 * Google (amarelo, rosa) que somem no tema claro.
 */
export function readable(hex: string, scheme: ColorScheme): string {
  if (scheme === 'dark') return hex;
  const { r, g, b } = hexToRgb(hex);
  const k = LIGHT_THEME_DARKEN_FACTOR;
  return `#${channelToHex(r * k)}${channelToHex(g * k)}${channelToHex(b * k)}`;
}
