import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { DEADLINE_TYPE_ICONS } from '@/features/deadlines';
import { isTypeVisible, setTypeVisible, useMeta, usePreferencesEditor } from '@/features/preferences';
import { Card, SectionTitle, Text, Toggle } from '@/shared/components';
import { iconSize, spacing, useTheme } from '@/theme';

export function VisibleTypesSection() {
  const { colors } = useTheme();
  const meta = useMeta();
  const { prefs, update } = usePreferencesEditor();

  return (
    <>
      <SectionTitle title="Tipos visíveis" />
      <Card style={styles.card}>
        {meta.data?.types.map((type) => (
          <View key={type.id} style={styles.row}>
            <Ionicons name={DEADLINE_TYPE_ICONS[type.id]} size={iconSize.lg} color={colors.textMuted} />
            <Text style={styles.label}>{type.label}</Text>
            <Toggle
              value={prefs ? isTypeVisible(prefs, type.id) : true}
              onValueChange={(visible) => update((p) => setTypeVisible(p, type.id, visible))}
              accessibilityLabel={`Mostrar ${type.label}`}
            />
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: { flex: 1 },
});
