import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  tone?: 'default' | 'raised' | 'accent';
  pressable?: boolean;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Card({
  title,
  subtitle,
  children,
  tone = 'default',
  pressable = false,
  onPress,
  style,
  contentStyle,
}: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 22,
      bounciness: 5,
    }).start();
  };

  const inner = (
    <Animated.View
      style={[
        styles.card,
        tone === 'raised' && styles.raised,
        tone === 'accent' && styles.accent,
        { transform: [{ scale }] },
        style,
      ]}
    >
      <LinearGradient
        colors={tone === 'accent' ? ['rgba(142, 214, 255, 0.18)', 'rgba(24, 35, 58, 0.92)'] : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={contentStyle}>{children}</View>
      </LinearGradient>
    </Animated.View>
  );

  if (!pressable) {
    return inner;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => animateTo(0.985)}
      onPressOut={() => animateTo(1)}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: appTheme.radius.xl,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    overflow: 'hidden',
    backgroundColor: appTheme.colors.surface,
    ...appTheme.shadows.card,
  },
  raised: {
    borderColor: appTheme.colors.borderStrong,
  },
  accent: {
    borderColor: 'rgba(142, 214, 255, 0.28)',
  },
  gradient: {
    padding: appTheme.spacing.lg,
    gap: appTheme.spacing.sm,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});