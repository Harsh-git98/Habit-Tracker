import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type DatePickerProps = {
  label: string;
  value: string;
  placeholder?: string;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
};

export function DatePicker({ label, value, placeholder = 'Select date', onPress, style }: DatePickerProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={style}>
      <View style={styles.container}>
        <View style={styles.textBlock}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, !value && styles.placeholder]}>{value || placeholder}</Text>
        </View>
        <MaterialCommunityIcons name="calendar-month-outline" size={22} color={appTheme.colors.accent} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    borderRadius: appTheme.radius.xl,
    paddingHorizontal: appTheme.spacing.lg,
    paddingVertical: appTheme.spacing.md,
    borderWidth: 1,
    borderColor: appTheme.colors.borderStrong,
    backgroundColor: appTheme.colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...appTheme.shadows.card,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: appTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    color: appTheme.colors.textMuted,
    fontWeight: '600',
  },
});