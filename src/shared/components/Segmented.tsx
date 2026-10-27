import { StyleSheet, View } from 'react-native';

import { haptics } from '@/shared/lib/haptics';
import { borderWidth, motion, radius, spacing, useTheme } from '@/theme';

import { Pressable } from './Pressable';
import { Text } from './Text';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange(v: T): void;
}

const TRACK_PADDING = spacing.xxs;

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            scale={motion.noScale}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (!active) haptics.selection();
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
  track: { flexDirection: 'row', borderRadius: radius.md, borderWidth: borderWidth.hairline, padding: TRACK_PADDING },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    // Cantos concêntricos com o trilho.
    borderRadius: radius.md - TRACK_PADDING,
    borderWidth: borderWidth.hairline,
    borderColor: 'transparent',
  },
});
