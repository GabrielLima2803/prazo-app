import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCourses, useMeta, usePreferences, useSavePreferences } from '@/api/hooks';
import type { Course, Preferences } from '@/api/types';
import { Card } from '@/components/Card';
import { ColorPicker } from '@/components/ColorPicker';
import { Pressable } from '@/components/Pressable';
import { Empty, ErrorState, Loading } from '@/components/States';
import { Text } from '@/components/Text';
import { Toggle } from '@/components/Toggle';
import { relative } from '@/lib/dates';
import { useNow } from '@/lib/useNow';
import { radius, readable, spacing, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const now = useNow();
  const courses = useCourses();
  const meta = useMeta();
  const prefs = usePreferences();
  const save = useSavePreferences();
  const [open, setOpen] = useState<string | null>(null);

  if (courses.isPending || prefs.isPending || meta.isPending) return <Loading />;
  if (courses.error) return <ErrorState message={courses.error.message} onRetry={courses.refetch} />;
  if (!prefs.data || !meta.data) return <ErrorState message="Não foi possível carregar as preferências." onRetry={prefs.refetch} />;

  const current: Preferences = prefs.data;
  const update = (patch: Partial<Preferences>) => save.mutate({ ...current, ...patch });

  const toggleHidden = (c: Course, show: boolean) =>
    update({
      hiddenCourses: show ? current.hiddenCourses.filter((x) => x !== c.code) : [...current.hiddenCourses, c.code],
    });

  return (
    <FlatList
      data={courses.data}
      keyExtractor={(c) => c.code}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl }}
      refreshControl={<RefreshControl refreshing={courses.isRefetching} onRefresh={() => void courses.refetch()} tintColor={colors.primary} />}
      ListHeaderComponent={
        <View style={{ gap: 4, marginBottom: spacing.sm }}>
          <Text variant="display">Disciplinas</Text>
          <Text tone="muted">Escolha a cor de cada uma na agenda e esconda o que não interessa.</Text>
        </View>
      }
      ListEmptyComponent={<Empty icon="layers-outline" title="Nenhuma disciplina" message="As disciplinas aparecem quando houver prazos no Moodle." />}
      renderItem={({ item: c }) => {
        const shown = !current.hiddenCourses.includes(c.code);
        const color = meta.data.palette.find((p) => p.id === (current.courseColors[c.code] ?? c.colorId))?.hex ?? c.color;
        const expanded = open === c.code;
        return (
          <Card style={{ opacity: shown ? 1 : 0.55, padding: 0 }}>
            <View style={styles.row}>
              <Pressable
                onPress={() => setOpen(expanded ? null : c.code)}
                accessibilityRole="button"
                accessibilityLabel={`Trocar a cor de ${c.code}`}
                style={[styles.swatch, { backgroundColor: tint(color, 0.18), borderColor: color }]}
              >
                <Text variant="bodyStrong" color={readable(color, scheme)}>
                  {c.code.slice(0, 3)}
                </Text>
              </Pressable>
              <Pressable scale={1} onPress={() => setOpen(expanded ? null : c.code)} style={{ flex: 1, gap: 2 }}>
                <Text variant="headline">{c.code}</Text>
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {c.pending > 0
                    ? `${c.pending} pendente${c.pending > 1 ? 's' : ''} · próximo ${relative(new Date(c.nextDue!), now)}`
                    : `${c.total} prazo${c.total !== 1 ? 's' : ''} · nada pendente`}
                </Text>
              </Pressable>
              <Toggle value={shown} onValueChange={(v) => toggleHidden(c, v)} accessibilityLabel={`Mostrar ${c.code}`} />
            </View>
            {expanded && (
              <View style={[styles.picker, { borderTopColor: colors.border }]}>
                <View style={styles.pickerHeader}>
                  <Ionicons name="color-palette-outline" size={16} color={colors.textMuted} />
                  <Text variant="caption" tone="muted">
                    Cor no Google Agenda
                  </Text>
                </View>
                <ColorPicker
                  palette={meta.data.palette}
                  value={current.courseColors[c.code] ?? c.colorId}
                  onChange={(id) => update({ courseColors: { ...current.courseColors, [c.code]: id } })}
                />
              </View>
            )}
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  swatch: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  picker: { borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.lg, gap: spacing.md },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
