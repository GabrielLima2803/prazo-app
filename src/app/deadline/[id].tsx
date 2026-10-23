import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDeadlines } from '@/api/hooks';
import { CourseBadge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { UrgencyTag } from '@/components/UrgencyTag';
import { Pressable } from '@/components/Pressable';
import { Empty, Loading } from '@/components/States';
import { Text } from '@/components/Text';
import { countdown, dueOf, formatFullDate, formatTime, reminderLabel, urgency } from '@/lib/dates';
import { typeIcon } from '@/lib/icons';
import { useNow } from '@/lib/useNow';
import { radius, spacing, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function DeadlineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const now = useNow(10_000);
  const { data, isPending } = useDeadlines();

  if (isPending) return <Loading />;
  const d = data?.deadlines.find((x) => x.id === id);
  if (!d) return <Empty icon="search-outline" title="Prazo não encontrado" message="Ele pode ter sido removido do Moodle." />;

  const due = dueOf(d);
  const start = new Date(d.startsAt);
  const left = due.getTime() - now;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <LinearGradient
          colors={[tint(d.color, 0.45), tint(d.color, 0.08), colors.background]}
          style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
        >
          <View style={styles.heroTop}>
            <CourseBadge code={d.courseCode} color={d.color} size="lg" />
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Fechar" style={[styles.close, { backgroundColor: colors.surface }]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.typeRow}>
            <Ionicons name={typeIcon[d.type]} size={16} color={colors.textMuted} />
            <Text variant="caption" tone="muted">
              {d.label}
            </Text>
          </View>
          <Text variant="title">{d.title}</Text>
          <Text variant="caption" tone="subtle" numberOfLines={1}>
            {d.courseName || 'Evento pessoal'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          <Card style={styles.countdown}>
            <View>
              <Text variant="caption" tone="muted">
                {d.submitted ? 'Situação' : left >= 0 ? 'Faltam' : 'Encerrado'}
              </Text>
              <Text variant="display" style={{ fontVariant: ['tabular-nums'] }}>
                {d.submitted ? 'Entregue ✅' : countdown(due, now)}
              </Text>
            </View>
            <UrgencyTag urgency={urgency(d, now)} />
          </Card>

          <Card style={{ gap: spacing.lg }}>
            <Row icon="calendar-outline" label="Data">
              {formatFullDate(due)}
            </Row>
            <Row icon="time-outline" label="Horário">
              {d.instant ? `até ${formatTime(due)}` : `${formatTime(start)} às ${formatTime(due)}`}
            </Row>
            <Row icon="notifications-outline" label="Lembretes no Google Agenda">
              {d.reminders.length ? d.reminders.map(reminderLabel).join(' · ') : 'Nenhum'}
            </Row>
          </Card>

          {d.description !== '' && (
            <Card style={{ gap: spacing.sm }}>
              <Text variant="overline" tone="muted">
                Descrição
              </Text>
              <Text style={{ lineHeight: 23 }}>{d.description}</Text>
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button label="Abrir no Moodle" icon="open-outline" onPress={() => Linking.openURL(d.url)} />
      </View>
    </View>
  );
}

function Row({ icon, label, children }: { icon: ComponentProps<typeof Ionicons>['name']; label: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="bodyStrong">{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.sm },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  close: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  countdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  rowIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth },
});
