import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { IconName } from '@/shared/types/icons';
import { alpha, spacing, tint, useTheme } from '@/theme';

import { Button } from './Button';
import { IconBox } from './IconBox';
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
  icon: IconName;
  title: string;
  message?: string;
}

export function Empty({ icon, title, message }: EmptyProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, styles.spacious]}>
      <IconBox icon={icon} size="lg" color={colors.primary} background={colors.primarySoft} style={styles.icon} />
      <Text variant="headline" style={styles.centered}>
        {title}
      </Text>
      {message && (
        <Text tone="muted" style={styles.centered}>
          {message}
        </Text>
      )}
    </View>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel = 'Tentar de novo' }: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, styles.spacious]}>
      <IconBox icon="cloud-offline-outline" size="lg" color={colors.danger} background={tint(colors.danger, alpha.medium)} style={styles.icon} />
      <Text variant="headline">Algo deu errado</Text>
      <Text tone="muted" style={styles.centered}>
        {message}
      </Text>
      {onRetry && <Button label={retryLabel} variant="secondary" icon="refresh" onPress={onRetry} style={styles.retry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  spacious: { paddingVertical: spacing.xxxl },
  icon: { marginBottom: spacing.sm },
  centered: { textAlign: 'center' },
  retry: { marginTop: spacing.sm },
});
