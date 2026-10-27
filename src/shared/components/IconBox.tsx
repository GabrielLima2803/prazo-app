import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { IconName } from '@/shared/types/icons';
import { iconSize, radius, size as sizes } from '@/theme';

const variants = {
  sm: { box: sizes.iconBoxSm, icon: iconSize.lg, radius: radius.md },
  md: { box: sizes.iconBoxMd, icon: iconSize.xl, radius: radius.md },
  lg: { box: sizes.iconBoxLg, icon: iconSize.xxl, radius: radius.xl },
  xl: { box: sizes.iconBoxXl, icon: iconSize.hero, radius: radius.xl },
} as const;

interface Props {
  icon: IconName;
  color: string;
  background: string;
  size?: keyof typeof variants;
  style?: StyleProp<ViewStyle>;
}

/** Ícone centralizado num quadrado de cantos arredondados. */
export function IconBox({ icon, color, background, size = 'sm', style }: Props) {
  const v = variants[size];
  return (
    <View style={[styles.box, { width: v.box, height: v.box, borderRadius: v.radius, backgroundColor: background }, style]}>
      <Ionicons name={icon} size={v.icon} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
