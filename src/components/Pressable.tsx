import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Escala ao pressionar; 1 desliga. */
  scale?: number;
}

/** Pressable com o feedback tátil-visual padrão do app. */
export function Pressable({ style, scale = 0.97, ...rest }: Props) {
  return (
    <RNPressable
      style={({ pressed }) => [style, pressed && { opacity: 0.85, transform: [{ scale }] }]}
      {...rest}
    />
  );
}
