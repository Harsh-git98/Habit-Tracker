import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '../../theme/appTheme';
import { Card } from './Card';

type QuoteCardProps = {
  quote: string;
  author?: string;
  label?: string;
};

export function QuoteCard({ quote, author, label = 'Motivation' }: QuoteCardProps) {
  return (
    <Card tone="accent" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="star-four-points-outline" size={14} color={appTheme.colors.accent} />
          <Text style={styles.badgeText}>{label}</Text>
        </View>
      </View>
      <Text style={styles.quote}>{quote}</Text>
      {author ? <Text style={styles.author}>— {author}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(142, 214, 255, 0.12)',
  },
  badgeText: {
    color: appTheme.colors.accent,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  quote: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: appTheme.spacing.md,
  },
  author: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: appTheme.spacing.sm,
  },
});