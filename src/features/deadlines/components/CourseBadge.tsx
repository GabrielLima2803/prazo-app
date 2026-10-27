import { StyleSheet, View } from 'react-native';

import { Text } from '@/shared/components';
import { alpha, letterSpacing, radius, readable, spacing, tint, useTheme } from '@/theme';

const PERSONAL_BADGE = 'PESSOAL';

type BadgeSize = 'sm' | 'lg';

/** Sigla da disciplina na cor dela. */
export function CourseBadge({ code, color, size = 'sm' }: { code: string; color: string; size?: BadgeSize }) {
  const { scheme } = useTheme();
  const large = size === 'lg';
  return (
    <View style={[styles.badge, large ? styles.large : styles.small, { backgroundColor: tint(color, alpha.strong) }]}>
      <Text variant={large ? 'bodyStrong' : 'overline'} color={readable(color, scheme)} style={styles.label}>
        {code || PERSONAL_BADGE}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: radius.sm, alignSelf: 'flex-start' },
  small: { paddingHorizontal: spacing.xsm, paddingVertical: spacing.xxs },
  large: { paddingHorizontal: spacing.sml, paddingVertical: spacing.xs },
  label: { letterSpacing: letterSpacing.wide },
});
