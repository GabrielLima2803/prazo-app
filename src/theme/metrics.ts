/** Escala de espaçamento (padding, margin, gap). */
export const spacing = {
  xxs: 2,
  xs: 4,
  xsm: 6,
  sm: 8,
  sml: 10,
  md: 12,
  mdl: 14,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 64,
} as const;

export const radius = {
  xs: 2,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const borderWidth = {
  hairline: 1,
  thick: 1.5,
  focus: 3,
} as const;

export const iconSize = {
  xxs: 12,
  xs: 14,
  sm: 15,
  md: 16,
  lg: 18,
  xl: 20,
  tab: 23,
  xxl: 28,
  logo: 32,
  hero: 36,
} as const;

/** Dimensões fixas de elementos (quadrados, círculos, barras). */
export const size = {
  separatorDot: 3,
  accentBar: 4,
  progressDot: 8,
  progressBarWidth: 28,
  progressBarHeight: 3,
  stepBadge: 22,
  colorSwatch: 36,
  iconButton: 36,
  iconBoxSm: 36,
  iconBoxMd: 40,
  courseSwatch: 48,
  iconBoxLg: 64,
  brandLogo: 72,
  iconBoxXl: 80,
  glow: 200,
  heroFooterReserve: 120,
} as const;

export const opacity = {
  disabled: 0.4,
  hidden: 0.55,
  inactive: 0.6,
  secondary: 0.8,
  emphasis: 0.85,
  pressed: 0.85,
} as const;

/** Transparências usadas com tint() para fundos coloridos. */
export const alpha = {
  faint: 0.08,
  soft: 0.12,
  medium: 0.14,
  strong: 0.18,
  heavy: 0.45,
  glow: 0.12,
  overlayChip: 0.18,
  selectedRing: 0.9,
} as const;

export const motion = {
  /** Escala aplicada ao pressionar um elemento; 1 desliga o efeito. */
  pressScale: 0.97,
  noScale: 1,
} as const;

/** Largura máxima de parágrafos centralizados. */
export const maxTextWidth = {
  narrow: 300,
  wide: 320,
} as const;
