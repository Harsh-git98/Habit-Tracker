import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';

import { appTheme } from '../../theme/appTheme';

type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  rightSlot?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, helperText, errorText, leftIcon, rightSlot, containerStyle, inputStyle, style, ...props },
  ref,
) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, errorText && styles.fieldError]}>
        {leftIcon ? <MaterialCommunityIcons name={leftIcon} size={20} color={appTheme.colors.textMuted} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={appTheme.colors.textMuted}
          style={[styles.input, inputStyle, style]}
          {...props}
        />
        {rightSlot ? <View>{rightSlot}</View> : null}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: appTheme.colors.textSecondary,
    fontSize: appTheme.typography.small,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  field: {
    minHeight: 52,
    borderRadius: appTheme.radius.lg,
    paddingHorizontal: appTheme.spacing.md,
    borderWidth: 1,
    borderColor: appTheme.colors.borderStrong,
    backgroundColor: appTheme.colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
  },
  fieldError: {
    borderColor: appTheme.colors.danger,
  },
  input: {
    flex: 1,
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.body,
    minHeight: 20,
    paddingVertical: 0,
  },
  helper: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  error: {
    color: appTheme.colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
});