import { View } from 'react-native';

import { spacing } from '@/theme/tokens';

import { Text } from './Text';

export function SectionTitle({ title, trailing }: { title: string; trailing?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: spacing.xl, paddingBottom: spacing.sm }}>
      <Text variant="overline" tone="muted">
        {title}
      </Text>
      {trailing && (
        <Text variant="caption" tone="subtle">
          {trailing}
        </Text>
      )}
    </View>
  );
}
