import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '../../theme/appTheme';
import { Card } from './Card';
import type { DiaryMood } from '../../features/diary/diaryTypes';
import { DIARY_MOOD_EMOJI, DIARY_MOOD_LABELS } from '../../features/diary/diaryTypes';

type DiaryEntryCardProps = {
  title: string;
  content: string;
  timestampLabel: string;
  mood: DiaryMood;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function DiaryEntryCard({ title, content, timestampLabel, mood, onPress, onEdit, onDelete }: DiaryEntryCardProps) {
  return (
    <Card pressable={!!onPress} onPress={onPress} tone="raised" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timestamp}>{timestampLabel}</Text>
        </View>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{DIARY_MOOD_EMOJI[mood]}</Text>
          <Text style={styles.moodLabel}>{DIARY_MOOD_LABELS[mood]}</Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={4}>
        {content}
      </Text>

      <View style={styles.actions}>
        {onEdit ? <ActionButton label="Edit" icon="pencil" onPress={onEdit} /> : null}
        {onDelete ? <ActionButton label="Delete" icon="delete-outline" onPress={onDelete} /> : null}
      </View>
    </Card>
  );
}

function ActionButton({ label, icon, onPress }: { label: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; onPress: () => void }) {
  return (
    <View style={styles.actionButton}>
      <MaterialCommunityIcons name={icon} size={14} color={appTheme.colors.textMuted} />
      <Text style={styles.actionText} onPress={onPress}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  timestamp: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(142, 214, 255, 0.08)',
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  content: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: appTheme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    flexWrap: 'wrap',
    marginTop: appTheme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: appTheme.colors.tint,
  },
  actionText: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});