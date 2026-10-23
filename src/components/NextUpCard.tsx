import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Deadline } from '@/api/types';
import { countdown, dayLabel, dueOf, formatTime } from '@/lib/dates';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Pressable } from './Pressable';
import { Text } from './Text';

/** Destaque do próximo prazo, no topo da tela. */
export function NextUpCard({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const router = useRouter();
  const due = dueOf(deadline);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/deadline/[id]', params: { id: deadline.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Próximo prazo: ${deadline.title}, em ${countdown(due, now)}`}
    >
      <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.glow} />
        <View style={styles.row}>
          <View style={styles.chip}>
            <Ionicons name="flash" size={12} color="#FFFFFF" />
            <Text variant="overline" tone="inverse">
              Próximo prazo
            </Text>
          </View>
          <Text variant="overline" tone="inverse" style={{ opacity: 0.85 }}>
            {deadline.courseCode || 'Pessoal'}
          </Text>
        </View>

        <Text variant="title" tone="inverse" numberOfLines={2}>
          {deadline.title}
        </Text>

        <View style={[styles.row, { alignItems: 'flex-end' }]}>
          <View>
            <Text variant="caption" tone="inverse" style={{ opacity: 0.8 }}>
              Faltam
            </Text>
            <Text variant="display" tone="inverse" style={{ fontVariant: ['tabular-nums'] }}>
              {countdown(due, now)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="bodyStrong" tone="inverse">
              {dayLabel(due, now)}
            </Text>
            <Text variant="caption" tone="inverse" style={{ opacity: 0.8 }}>
              até {formatTime(due)} · {deadline.label}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, overflow: 'hidden' },
  glow: {
    position: 'absolute', right: -60, top: -60, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4,
  },
});
