import { StyleSheet, View } from 'react-native';

import { IconBox, Text } from '@/shared/components';
import { spacing, useTheme } from '@/theme';

import { GOOGLE_BENEFITS } from '../constants';

export function BenefitList() {
  const { colors } = useTheme();
  return (
    <View style={styles.list}>
      {GOOGLE_BENEFITS.map(({ icon, text }) => (
        <View key={text} style={styles.item}>
          <IconBox icon={icon} color={colors.primary} background={colors.surfaceRaised} />
          <Text variant="bodyStrong">{text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
