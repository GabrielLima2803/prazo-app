import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';
import { Text } from './Text';

export function Loading() {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

interface EmptyProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
}

export function Empty({ icon, title, message }: EmptyProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { paddingVertical: spacing.xxl * 2 }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text variant="headline" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {message && (
        <Text tone="muted" style={{ textAlign: 'center' }}>
          {message}
        </Text>
      )}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { paddingVertical: spacing.xxl * 2 }]}>
      <View style={[styles.iconWrap, { backgroundColor: 'rgba(248,113,113,0.14)' }]}>
        <Ionicons name="cloud-offline-outline" size={28} color={colors.danger} />
      </View>
      <Text variant="headline">Algo deu errado</Text>
      <Text tone="muted" style={{ textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry && <Button label="Tentar de novo" variant="secondary" icon="refresh" onPress={onRetry} style={{ marginTop: spacing.sm }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  iconWrap: { width: 64, height: 64, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
});
