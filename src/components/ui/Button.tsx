import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  disabled,
  loading,
  onPress,
  style,
  labelStyle,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const content = (
    <Animated.View
      style={[
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        stylesBySize[size],
        disabled && styles.disabled,
        { transform: [{ scale }] },
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[appTheme.colors.accent, appTheme.colors.accentStrong]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.label, styles.primaryLabel, labelStyle]}>{loading ? 'Loading...' : title}</Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </LinearGradient>
      ) : (
        <>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.label, variant === 'ghost' ? styles.ghostLabel : styles.secondaryLabel, labelStyle]}>
            {loading ? 'Loading...' : title}
          </Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </>
      )}
    </Animated.View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => animateTo(0.98)}
      onPressOut={() => animateTo(1)}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: appTheme.radius.full,
    minHeight: 48,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...appTheme.shadows.button,
  },
  gradient: {
    flex: 1,
    width: '100%',
    minHeight: 48,
    paddingHorizontal: appTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.borderStrong,
    paddingHorizontal: appTheme.spacing.lg,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: appTheme.spacing.md,
  },
  disabled: {
    opacity: 0.48,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  primaryLabel: {
    color: '#07111B',
  },
  secondaryLabel: {
    color: appTheme.colors.textPrimary,
  },
  ghostLabel: {
    color: appTheme.colors.textSecondary,
  },
  icon: {
    marginHorizontal: 4,
  },
});

const stylesBySize = StyleSheet.create({
  small: {
    minHeight: 40,
  },
  medium: {
    minHeight: 48,
  },
  large: {
    minHeight: 54,
  },
});