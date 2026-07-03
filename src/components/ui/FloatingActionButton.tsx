import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type FloatingActionButtonProps = {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
};

export function FloatingActionButton({ icon = 'plus', onPress, style }: FloatingActionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => animateTo(0.96)}
      onPressOut={() => animateTo(1)}
      style={style}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        <MaterialCommunityIcons name={icon} size={28} color="#06111A" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: appTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...appTheme.shadows.button,
  },
});