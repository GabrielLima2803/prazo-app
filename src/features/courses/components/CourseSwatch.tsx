import { StyleSheet } from 'react-native';

import { Pressable, Text } from '@/shared/components';
import { alpha, borderWidth, radius, readable, size, tint, useTheme } from '@/theme';

import { abbreviate } from '../lib/summary';

/** Quadrado com a sigla na cor da disciplina; tocar abre o seletor de cor. */
export function CourseSwatch({ code, color, onPress }: { code: string; color: string; onPress(): void }) {
  const { scheme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Trocar a cor de ${code}`}
      style={[styles.swatch, { backgroundColor: tint(color, alpha.strong), borderColor: color }]}
    >
      <Text variant="bodyStrong" color={readable(color, scheme)}>
        {abbreviate(code)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  swatch: {
    width: size.courseSwatch,
    height: size.courseSwatch,
    borderRadius: radius.md,
    borderWidth: borderWidth.thick,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
