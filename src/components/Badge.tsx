import { View } from 'react-native';

import { radius, readable, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

/** Sigla da disciplina na cor dela. */
export function CourseBadge({ code, color, size = 'sm' }: { code: string; color: string; size?: 'sm' | 'lg' }) {
  const { scheme } = useTheme();
  const lg = size === 'lg';
  return (
    <View
      style={{
        backgroundColor: tint(color, 0.18),
        borderRadius: radius.sm,
        paddingHorizontal: lg ? 10 : 7,
        paddingVertical: lg ? 5 : 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant={lg ? 'bodyStrong' : 'overline'} color={readable(color, scheme)} style={{ letterSpacing: 0.6 }}>
        {code || 'PESSOAL'}
      </Text>
    </View>
  );
}
