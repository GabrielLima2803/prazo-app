import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { motion, opacity } from '@/theme';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Escala ao pressionar; motion.noScale desliga. */
  scale?: number;
}

/** Pressable com o feedback visual padrão do app. */
export function Pressable({ style, scale = motion.pressScale, ...rest }: Props) {
  return <RNPressable style={({ pressed }) => [style, pressed && { opacity: opacity.pressed, transform: [{ scale }] }]} {...rest} />;
}
