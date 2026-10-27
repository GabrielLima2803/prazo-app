import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/** Arquivos carregados por useFonts no layout raiz. */
export const fontAssets = { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold };

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 30,
} as const;

export const letterSpacing = {
  tighter: -0.6,
  tight: -0.3,
  snug: -0.2,
  wide: 0.6,
  wider: 0.8,
} as const;

/** Números com largura fixa, para contagens que mudam sem "pular". */
export const tabularNums = { fontVariant: ['tabular-nums' as const] };

export const type = {
  display: { fontFamily: fonts.bold, fontSize: fontSize.xxl, lineHeight: 36, letterSpacing: letterSpacing.tighter },
  title: { fontFamily: fonts.bold, fontSize: fontSize.xl, lineHeight: 28, letterSpacing: letterSpacing.tight },
  headline: { fontFamily: fonts.semibold, fontSize: fontSize.lg, lineHeight: 22, letterSpacing: letterSpacing.snug },
  body: { fontFamily: fonts.regular, fontSize: fontSize.md, lineHeight: 21 },
  reading: { fontFamily: fonts.regular, fontSize: fontSize.md, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: fontSize.md, lineHeight: 21 },
  caption: { fontFamily: fonts.medium, fontSize: fontSize.sm, lineHeight: 17 },
  overline: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.xs,
    lineHeight: 14,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  mono: { fontFamily: fonts.semibold, fontSize: fontSize.sm, lineHeight: 17, ...tabularNums },
} as const;

export type TextVariant = keyof typeof type;
