import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { appTheme } from '../../theme/appTheme';
import { Card } from './Card';
import { Button } from './Button';
import { TASK_REPEAT_LABELS, type TaskRepeat } from '../../features/tasks/taskTypes';

type TaskCardProps = {
  title: string;
  time: string;
  note: string;
  dueDate?: string;
  repeat?: TaskRepeat;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  onPress?: PressableProps['onPress'];
  onCompleteToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  motivationNote?: string;
};

export function TaskCard({
  title,
  time,
  note,
  dueDate = 'No due date',
  repeat = 'none',
  priority = 'medium',
  completed = false,
  onPress,
  onCompleteToggle,
  onEdit,
  onDelete,
  motivationNote,
}: TaskCardProps) {
  return (
    <Card tone={completed ? 'raised' : 'default'} style={styles.card}>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" onPress={onCompleteToggle} style={[styles.check, completed && styles.checkDone]}>
          <MaterialCommunityIcons name={completed ? 'check' : 'circle-outline'} size={20} color={completed ? '#06111A' : appTheme.colors.accent} />
        </Pressable>
        <View style={styles.textBlock}>
          <Pressable onPress={onPress} style={styles.titleRow} accessibilityRole="button">
            <Text style={[styles.title, completed && styles.completed]}>{title}</Text>
            <View style={[styles.pill, styles[priority]]}>
              <Text style={styles.pillText}>{priority}</Text>
            </View>
          </Pressable>
          <Text style={styles.note}>{note}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={appTheme.colors.textMuted} />
          <Text style={styles.metaText}>{time}</Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons name="ray-start-end" size={14} color={appTheme.colors.textMuted} />
          <Text style={styles.metaText}>{completed ? 'Completed' : 'Planned'}</Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons name="calendar-month-outline" size={14} color={appTheme.colors.textMuted} />
          <Text style={styles.metaText}>{dueDate}</Text>
        </View>
        <View style={styles.metaPill}>
          <MaterialCommunityIcons name="repeat" size={14} color={appTheme.colors.textMuted} />
          <Text style={styles.metaText}>{TASK_REPEAT_LABELS[repeat]}</Text>
        </View>
      </View>
      {motivationNote ? (
        <View style={styles.motivationBox}>
          <MaterialCommunityIcons name="format-quote-close" size={14} color={appTheme.colors.accent} />
          <Text style={styles.motivationText}>{motivationNote}</Text>
        </View>
      ) : null}
      {onCompleteToggle || onEdit || onDelete ? (
        <View style={styles.actionRow}>
          {onCompleteToggle ? (
            <Button
              title={completed ? 'Mark incomplete' : 'Mark complete'}
              size="small"
              variant={completed ? 'secondary' : 'primary'}
              onPress={onCompleteToggle}
              style={styles.actionButton}
            />
          ) : null}
          {onEdit ? <Button title="Edit" size="small" variant="ghost" onPress={onEdit} style={styles.actionButton} /> : null}
          {onDelete ? <Button title="Delete" size="small" variant="ghost" onPress={onDelete} style={styles.actionButton} /> : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: appTheme.spacing.md,
  },
  check: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(142, 214, 255, 0.12)',
  },
  checkDone: {
    backgroundColor: appTheme.colors.accent,
  },
  textBlock: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: appTheme.spacing.sm,
  },
  title: {
    flex: 1,
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  completed: {
    color: appTheme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  note: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  pill: {
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  high: {
    backgroundColor: 'rgba(255, 141, 141, 0.14)',
  },
  medium: {
    backgroundColor: 'rgba(255, 212, 122, 0.14)',
  },
  low: {
    backgroundColor: 'rgba(103, 226, 180, 0.14)',
  },
  pillText: {
    color: appTheme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: appTheme.spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: appTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: appTheme.colors.tint,
  },
  metaText: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
    marginTop: appTheme.spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: 104,
  },
  motivationBox: {
    marginTop: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.sm,
    borderRadius: appTheme.radius.lg,
    backgroundColor: 'rgba(142, 214, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  motivationText: {
    flex: 1,
    color: appTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});