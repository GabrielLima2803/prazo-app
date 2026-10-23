export type ColorScheme = 'light' | 'dark';

export interface Palette {
  background: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryText: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
  gradient: readonly [string, string];
}

const dark: Palette = {
  background: '#0B0D12',
  surface: '#141821',
  surfaceRaised: '#1B2030',
  border: '#252B3B',
  text: '#F2F4F8',
  textMuted: '#8B93A7',
  textSubtle: '#5D6579',
  primary: '#8B6CFF',
  primaryText: '#FFFFFF',
  primarySoft: 'rgba(139, 108, 255, 0.16)',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  overlay: 'rgba(5, 6, 10, 0.6)',
  gradient: ['#6D4BFF', '#B05CFF'],
};

const light: Palette = {
  background: '#F4F5F9',
  surface: '#FFFFFF',
  surfaceRaised: '#F0F1F7',
  border: '#E3E6EE',
  text: '#0E1220',
  textMuted: '#5F6880',
  textSubtle: '#9AA1B2',
  primary: '#5B3DF5',
  primaryText: '#FFFFFF',
  primarySoft: 'rgba(91, 61, 245, 0.10)',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  overlay: 'rgba(14, 18, 32, 0.35)',
  gradient: ['#5B3DF5', '#9B4DFF'],
};

export const palettes = { dark, light };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  headline: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 17 },
  overline: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  mono: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17, fontVariant: ['tabular-nums' as const] },
} as const;

/** Mistura uma cor hex com transparência: tint("#039BE5", 0.15). */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Cor de texto legível sobre fundo claro: escurece as cores da paleta do
 * Google (amarelo, rosa) que somem no tema claro.
 */
export function readable(hex: string, scheme: ColorScheme): string {
  if (scheme === 'dark') return hex;
  const n = parseInt(hex.replace('#', ''), 16);
  const k = 0.62;
  const ch = (v: number) => Math.round(v * k).toString(16).padStart(2, '0');
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}
