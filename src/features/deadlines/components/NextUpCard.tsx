import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/core/api';
import { Pressable, Text } from '@/shared/components';
import { countdown, dayLabel, formatTime } from '@/shared/lib/dateFormat';
import { alpha, fixedColors, gradientDirection, iconSize, opacity, radius, size, spacing, tabularNums, tint, useTheme } from '@/theme';

import { courseLabel } from '../lib/format';
import { dueOf } from '../lib/urgency';
import { deadlineHref } from '../navigation';

/** Destaque do próximo prazo, no topo da tela. */
export function NextUpCard({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  const due = dueOf(deadline);
  const remaining = countdown(due, now);

  return (
    <Pressable
      onPress={() => router.push(deadlineHref(deadline.id))}
      accessibilityRole="button"
      accessibilityLabel={`Próximo prazo: ${deadline.title}, em ${remaining}`}
    >
      <LinearGradient colors={colors.gradient} {...gradientDirection} style={styles.card}>
        <View style={styles.glow} />
        <View style={styles.row}>
          <View style={styles.chip}>
            <Ionicons name="flash" size={iconSize.xxs} color={fixedColors.white} />
            <Text variant="overline" tone="inverse">
              Próximo prazo
            </Text>
          </View>
          <Text variant="overline" tone="inverse" style={styles.emphasis}>
            {courseLabel(deadline)}
          </Text>
        </View>

        <Text variant="title" tone="inverse" numberOfLines={2}>
          {deadline.title}
        </Text>

        <View style={[styles.row, styles.bottom]}>
          <View>
            <Text variant="caption" tone="inverse" style={styles.secondary}>
              Faltam
            </Text>
            <Text variant="display" tone="inverse" style={tabularNums}>
              {remaining}
            </Text>
          </View>
          <View style={styles.trailing}>
            <Text variant="bodyStrong" tone="inverse">
              {dayLabel(due, now)}
            </Text>
            <Text variant="caption" tone="inverse" style={styles.secondary}>
              até {formatTime(due)} · {deadline.label}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/** Fração do brilho decorativo que fica para fora do canto superior direito. */
const GLOW_OVERFLOW_RATIO = 0.3;
const GLOW_OFFSET = -size.glow * GLOW_OVERFLOW_RATIO;

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  glow: {
    position: 'absolute',
    right: GLOW_OFFSET,
    top: GLOW_OFFSET,
    width: size.glow,
    height: size.glow,
    borderRadius: radius.pill,
    backgroundColor: tint(fixedColors.white, alpha.glow),
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottom: { alignItems: 'flex-end' },
  trailing: { alignItems: 'flex-end' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: tint(fixedColors.white, alpha.overlayChip),
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sml,
    paddingVertical: spacing.xs,
  },
  emphasis: { opacity: opacity.emphasis },
  secondary: { opacity: opacity.secondary },
});
