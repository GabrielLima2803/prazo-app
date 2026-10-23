import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import type { Urgency } from '@/lib/dates';
import { radius, tint } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Text } from './Text';

const meta: Record<Urgency, { label: string; icon: ComponentProps<typeof Ionicons>['name'] }> = {
  overdue: { label: 'Encerrado', icon: 'lock-closed' },
  critical: { label: 'Urgente', icon: 'flame' },
  soon: { label: 'Em breve', icon: 'alarm' },
  later: { label: 'Com folga', icon: 'leaf' },
  done: { label: 'Entregue', icon: 'checkmark-circle' },
};

export function UrgencyTag({ urgency }: { urgency: Urgency }) {
  const { colors } = useTheme();
  const color: Record<Urgency, string> = {
    overdue: colors.textSubtle,
    critical: colors.danger,
    soon: colors.warning,
    later: colors.success,
    done: colors.success,
  };
  const c = color[urgency];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: tint(c, 0.14), borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 }}>
      <Ionicons name={meta[urgency].icon} size={14} color={c} />
      <Text variant="caption" color={c}>
        {meta[urgency].label}
      </Text>
    </View>
  );
}
