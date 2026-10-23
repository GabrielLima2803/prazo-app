import { View } from 'react-native';

import type { Deadline } from '@/api/types';
import { countdown, dueOf, urgency, type Urgency } from '@/lib/dates';
import { radius, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

export function CountdownPill({ deadline, now }: { deadline: Deadline; now: number }) {
  const { colors } = useTheme();
  const u = urgency(deadline, now);
  const color: Record<Urgency, string> = {
    overdue: colors.textSubtle,
    critical: colors.danger,
    soon: colors.warning,
    later: colors.primary,
    done: colors.success,
  };
  const label = u === 'done' ? 'Entregue' : countdown(dueOf(deadline), now);
  return (
    <View style={{ backgroundColor: tint(color[u], 0.14), borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text variant="mono" color={color[u]}>
        {label}
      </Text>
    </View>
  );
}

