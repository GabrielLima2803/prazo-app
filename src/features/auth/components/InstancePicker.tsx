import { StyleSheet, View } from 'react-native';

import { Pressable, Text } from '@/shared/components';
import { borderWidth, radius, spacing, useTheme } from '@/theme';

import { MOODLE_INSTANCES, type MoodleInstanceId } from '../constants';

export function InstancePicker({ value, onChange }: { value: MoodleInstanceId; onChange(id: MoodleInstanceId): void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {MOODLE_INSTANCES.map((i) => {
        const selected = i.id === value;
        return (
          <Pressable
            key={i.id}
            onPress={() => onChange(i.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.option,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primarySoft : colors.surface,
              },
            ]}
          >
            <Text variant="caption" tone={selected ? 'primary' : 'muted'} numberOfLines={1}>
              {i.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sml,
    paddingHorizontal: spacing.xsm,
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
  },
});
