import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { haptics } from '@/shared/lib/haptics';
import { alpha, borderWidth, fixedColors, iconSize, radius, size, spacing, tint } from '@/theme';

import { Pressable } from './Pressable';

export interface ColorOption {
  id: string;
  hex: string;
}

interface Props {
  palette: ColorOption[];
  value: string;
  onChange(id: string): void;
}

/** Grade de cores (as 11 cores de evento do Google Agenda). */
export function ColorPicker({ palette, value, onChange }: Props) {
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {palette.map((c) => {
        const selected = c.id === value;
        return (
          <Pressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Cor ${c.id}`}
            onPress={() => {
              haptics.selection();
              onChange(c.id);
            }}
            style={[styles.swatch, { backgroundColor: c.hex }, selected && styles.selected]}
          >
            {selected && <Ionicons name="checkmark" size={iconSize.lg} color={fixedColors.white} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sml },
  swatch: {
    width: size.colorSwatch,
    height: size.colorSwatch,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderWidth: borderWidth.focus, borderColor: tint(fixedColors.white, alpha.selectedRing) },
});
