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

/** Chave de uma cor sólida da paleta (exclui o gradiente). */
export type PaletteColor = Exclude<keyof Palette, 'gradient'>;

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

export const palettes: Record<ColorScheme, Palette> = { dark, light };

/** Cores iguais nos dois temas: texto sobre gradiente, marcas externas. */
export const fixedColors = {
  white: '#FFFFFF',
  moodle: '#F98012',
} as const;

/** Direção diagonal padrão dos gradientes (canto superior esquerdo → inferior direito). */
export const gradientDirection = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
} as const;
