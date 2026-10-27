import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconBox, Text } from '@/shared/components';
import type { IconName } from '@/shared/types/icons';
import { spacing, useTheme } from '@/theme';

export function DetailRow({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <IconBox icon={icon} color={colors.primary} background={colors.primarySoft} />
      <View style={styles.text}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="bodyStrong">{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  text: { flex: 1, gap: spacing.xxs },
});
