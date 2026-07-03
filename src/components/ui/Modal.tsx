import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Modal as RNModal, Pressable, StyleSheet, Text, View, type ModalProps, type StyleProp, type ViewStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type AppModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  presentationStyle?: ModalProps['presentationStyle'];
};

export function Modal({
  visible,
  title,
  description,
  onClose,
  children,
  containerStyle,
  presentationStyle = 'overFullScreen',
}: AppModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: visible ? 0 : 24,
        useNativeDriver: true,
        speed: 18,
        bounciness: 5,
      }),
    ]).start();
  }, [opacity, translateY, visible]);

  return (
    <RNModal transparent visible={visible} onRequestClose={onClose} presentationStyle={presentationStyle}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.sheet, { opacity, transform: [{ translateY }] }, containerStyle]}>
          <LinearGradient
            colors={[appTheme.colors.surfaceRaised, appTheme.colors.surfaceElevated]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <View style={styles.titleBlock}>
                <Text style={styles.title}>{title}</Text>
                {description ? <Text style={styles.description}>{description}</Text> : null}
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={20} color={appTheme.colors.textPrimary} />
              </Pressable>
            </View>
            <View style={styles.body}>{children}</View>
          </LinearGradient>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(2, 6, 14, 0.74)',
    padding: appTheme.spacing.md,
  },
  sheet: {
    borderRadius: appTheme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: appTheme.colors.borderStrong,
    ...appTheme.shadows.card,
  },
  gradient: {
    padding: appTheme.spacing.lg,
    gap: appTheme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  description: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  body: {
    gap: appTheme.spacing.md,
  },
});