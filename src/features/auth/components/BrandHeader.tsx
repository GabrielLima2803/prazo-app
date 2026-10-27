import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/shared/components';
import { fixedColors, gradientDirection, iconSize, maxTextWidth, radius, size, spacing, useTheme } from '@/theme';

const APP_NAME = 'Prazo';

export function BrandHeader({ intro }: { intro: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.brand}>
      <LinearGradient colors={colors.gradient} {...gradientDirection} style={styles.logo}>
        <Ionicons name="hourglass" size={iconSize.logo} color={fixedColors.white} />
      </LinearGradient>
      <Text variant="display" style={styles.centered}>
        {APP_NAME}
      </Text>
      <Text tone="muted" style={[styles.centered, styles.intro]}>
        {intro}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', gap: spacing.sm },
  logo: {
    width: size.brandLogo,
    height: size.brandLogo,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  centered: { textAlign: 'center' },
  intro: { maxWidth: maxTextWidth.narrow },
});
