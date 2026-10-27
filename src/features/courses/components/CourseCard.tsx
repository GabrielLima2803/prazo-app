import { StyleSheet, View } from 'react-native';

import type { CalendarColor, Course } from '@/core/api';
import { Card, Pressable, Text, Toggle } from '@/shared/components';
import { motion, opacity, spacing } from '@/theme';

import { courseSummary } from '../lib/summary';
import { CourseColorPanel } from './CourseColorPanel';
import { CourseSwatch } from './CourseSwatch';

interface Props {
  course: Course;
  now: number;
  visible: boolean;
  color: string;
  colorId: string;
  palette: CalendarColor[];
  expanded: boolean;
  onToggleExpanded(): void;
  onVisibleChange(visible: boolean): void;
  onColorChange(colorId: string): void;
}

export function CourseCard({
  course,
  now,
  visible,
  color,
  colorId,
  palette,
  expanded,
  onToggleExpanded,
  onVisibleChange,
  onColorChange,
}: Props) {
  return (
    <Card style={[styles.card, !visible && styles.hidden]}>
      <View style={styles.row}>
        <CourseSwatch code={course.code} color={color} onPress={onToggleExpanded} />
        <Pressable scale={motion.noScale} onPress={onToggleExpanded} style={styles.info}>
          <Text variant="headline">{course.code}</Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {courseSummary(course, now)}
          </Text>
        </Pressable>
        <Toggle value={visible} onValueChange={onVisibleChange} accessibilityLabel={`Mostrar ${course.code}`} />
      </View>
      {expanded && <CourseColorPanel palette={palette} value={colorId} onChange={onColorChange} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0 },
  hidden: { opacity: opacity.hidden },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  info: { flex: 1, gap: spacing.xxs },
});
