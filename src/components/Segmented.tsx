import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange(v: T): void;
}

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            scale={1}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (!active) Haptics.selectionAsync();
              onChange(o.value);
            }}
            style={[styles.item, active && { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text variant="caption" tone={active ? 'default' : 'muted'}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.md, borderWidth: 1, padding: 3 },
  item: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: radius.sm + 2, borderWidth: 1, borderColor: 'transparent' },
});
