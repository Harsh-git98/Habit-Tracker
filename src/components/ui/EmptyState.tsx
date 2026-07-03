import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet } from 'react-native';

import { appTheme } from '../../theme/appTheme';
import { Button } from './Button';
import { Card } from './Card';

type EmptyStateProps = {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ icon = 'star-outline', title, description, actionLabel, onActionPress }: EmptyStateProps) {
  return (
    <Card tone="raised" contentStyle={styles.content}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={24} color={appTheme.colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel ? <Button size="small" title={actionLabel} onPress={onActionPress} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: appTheme.spacing.xl,
    gap: appTheme.spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.accentSoft,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
});