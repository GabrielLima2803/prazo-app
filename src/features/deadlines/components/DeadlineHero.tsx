import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Deadline } from '@/core/api';
import { Pressable, Text } from '@/shared/components';
import { alpha, iconSize, radius, size, spacing, tint, useTheme } from '@/theme';

import { DEADLINE_TYPE_ICONS } from '../constants';
import { CourseBadge } from './CourseBadge';

const PERSONAL_EVENT_NAME = 'Evento pessoal';

/** Topo do detalhe: gradiente na cor da disciplina, título e botão de fechar. */
export function DeadlineHero({ deadline, onClose }: { deadline: Deadline; onClose(): void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[tint(deadline.color, alpha.heavy), tint(deadline.color, alpha.faint), colors.background]}
      style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
    >
      <View style={styles.top}>
        <CourseBadge code={deadline.courseCode} color={deadline.color} size="lg" />
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          style={[styles.close, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="close" size={iconSize.xl} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.typeRow}>
        <Ionicons name={DEADLINE_TYPE_ICONS[deadline.type]} size={iconSize.md} color={colors.textMuted} />
        <Text variant="caption" tone="muted">
          {deadline.label}
        </Text>
      </View>
      <Text variant="title">{deadline.title}</Text>
      <Text variant="caption" tone="subtle" numberOfLines={1}>
        {deadline.courseName || PERSONAL_EVENT_NAME}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.sm },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  close: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xsm },
});
