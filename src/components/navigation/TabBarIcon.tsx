import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, type ColorValue } from 'react-native';
import type { ComponentProps } from 'react';

import { appTheme } from '../../theme/appTheme';

type TabBarIconProps = {
  name: ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: ColorValue;
  focused: boolean;
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <View style={[styles.container, focused && styles.focused]}>
      <MaterialCommunityIcons name={name} size={22} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
    borderRadius: appTheme.radius.full,
  },
  focused: {
    backgroundColor: appTheme.colors.accentSoft,
  },
});