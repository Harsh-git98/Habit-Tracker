import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '../../theme/appTheme';
import { Card } from './Card';

type DiaryCardProps = {
  date: string;
  mood: string;
  excerpt: string;
  tags: string[];
};

export function DiaryCard({ date, mood, excerpt, tags }: DiaryCardProps) {
  return (
    <Card tone="raised" style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.mood}>{mood}</Text>
        </View>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="book-open-variant" size={18} color={appTheme.colors.accent} />
        </View>
      </View>
      <Text style={styles.excerpt}>{excerpt}</Text>
      <View style={styles.tagRow}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
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
    gap: appTheme.spacing.md,
  },
  date: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  mood: {
    color: appTheme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.accentSoft,
  },
  excerpt: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: appTheme.spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: appTheme.spacing.md,
  },
  tag: {
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: appTheme.colors.tint,
  },
  tagText: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});