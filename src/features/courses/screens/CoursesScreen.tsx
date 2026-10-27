import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { courseColorHex, courseColorId, isCourseVisible, setCourseColor, setCourseVisible, useMeta, usePreferencesEditor } from '@/features/preferences';
import { Empty, ErrorState, Loading, ScreenHeader } from '@/shared/components';
import { useNow } from '@/shared/hooks/useNow';
import { useScreenPadding } from '@/shared/hooks/useScreenPadding';
import { spacing, useTheme } from '@/theme';

import { useCourses } from '../api';
import { CourseCard } from '../components/CourseCard';

export function CoursesScreen() {
  const { colors } = useTheme();
  const padding = useScreenPadding();
  const now = useNow();
  const courses = useCourses();
  const meta = useMeta();
  const { query: prefsQuery, prefs, update } = usePreferencesEditor();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (courses.isPending || prefsQuery.isPending || meta.isPending) return <Loading />;
  if (courses.error) return <ErrorState message={courses.error.message} onRetry={courses.refetch} />;
  if (!prefs || !meta.data) return <ErrorState message="Não foi possível carregar as preferências." onRetry={prefsQuery.refetch} />;

  const palette = meta.data.palette;

  return (
    <FlatList
      data={courses.data}
      keyExtractor={(c) => c.code}
      contentContainerStyle={[padding, styles.list]}
      refreshControl={<RefreshControl refreshing={courses.isRefetching} onRefresh={() => void courses.refetch()} tintColor={colors.primary} />}
      ListHeaderComponent={<ScreenHeader title="Disciplinas" subtitle="Escolha a cor de cada uma na agenda e esconda o que não interessa." />}
      ListEmptyComponent={<Empty icon="layers-outline" title="Nenhuma disciplina" message="As disciplinas aparecem quando houver prazos no Moodle." />}
      renderItem={({ item: course }) => (
        <CourseCard
          course={course}
          now={now}
          palette={palette}
          visible={isCourseVisible(prefs, course.code)}
          color={courseColorHex(prefs, course, palette)}
          colorId={courseColorId(prefs, course)}
          expanded={expanded === course.code}
          onToggleExpanded={() => setExpanded((open) => (open === course.code ? null : course.code))}
          onVisibleChange={(visible) => update((p) => setCourseVisible(p, course.code, visible))}
          onColorChange={(id) => update((p) => setCourseColor(p, course.code, id))}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
