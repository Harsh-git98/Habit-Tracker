import { useWindowDimensions, View, StyleSheet, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { appTheme } from '../../theme/appTheme';

type AppScreenProps = ViewProps;

export function AppScreen({ style, ...props }: AppScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? appTheme.spacing.xxl : Math.max(appTheme.spacing.lg, Math.round(width * 0.05));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[appTheme.colors.background, appTheme.colors.backgroundAlt]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={[styles.screen, { paddingHorizontal: horizontalPadding }, style]} {...props}>
          {props.children}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  background: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 840,
    alignSelf: 'center',
    paddingTop: appTheme.spacing.lg,
    paddingBottom: appTheme.spacing.xl,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 9999,
    backgroundColor: 'rgba(142, 214, 255, 0.08)',
  },
  glowBottom: {
    position: 'absolute',
    left: -120,
    bottom: 100,
    width: 280,
    height: 280,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
  },
});