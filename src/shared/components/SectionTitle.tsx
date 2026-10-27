import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { Text } from './Text';

/** Título de seção em caixa alta, com um texto opcional à direita. */
export function SectionTitle({ title, trailing }: { title: string; trailing?: string | number }) {
  return (
    <View style={styles.row}>
      <Text variant="overline" tone="muted">
        {title}
      </Text>
      {trailing !== undefined && (
        <Text variant="caption" tone="subtle">
          {trailing}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: spacing.xl, paddingBottom: spacing.sm },
});
