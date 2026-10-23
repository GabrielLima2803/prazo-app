import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import type { Meta } from '@/api/types';
import { spacing } from '@/theme/tokens';

import { Pressable } from './Pressable';

interface Props {
  palette: Meta['palette'];
  value: string;
  onChange(id: string): void;
}

/** As 11 cores de evento do Google Agenda. */
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
              Haptics.selectionAsync();
              onChange(c.id);
            }}
            style={[styles.swatch, { backgroundColor: c.hex }, selected && styles.selected]}
          >
            {selected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm + 2 },
  swatch: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  selected: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
});
