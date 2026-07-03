import type { ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Card } from './Card';

type AppCardProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ title, subtitle, children, style }: AppCardProps) {
  return <Card title={title} subtitle={subtitle} style={style}>{children}</Card>;
}
