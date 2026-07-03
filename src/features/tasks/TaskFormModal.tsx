import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/DatePicker';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { TimePicker } from '../../components/ui/TimePicker';
import { appTheme } from '../../theme/appTheme';
import type { TaskDraft, TaskPriority, TaskRepeat } from './taskTypes';
import { TASK_PRIORITY_LABELS, TASK_REPEAT_LABELS } from './taskTypes';

type TaskFormModalProps = {
  visible: boolean;
  initialValues: TaskDraft;
  mode: 'add' | 'edit';
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
  onPreviewComplete?: () => void;
};

const priorityOptions: TaskPriority[] = ['high', 'medium', 'low'];
const repeatOptions: TaskRepeat[] = ['none', 'daily', 'weekly', 'weekdays', 'custom'];

export function TaskFormModal({ visible, initialValues, mode, onClose, onSubmit, onPreviewComplete }: TaskFormModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(initialValues);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  useEffect(() => {
    setDraft(initialValues);
  }, [initialValues, visible]);

  const canSubmit = useMemo(() => draft.title.trim().length > 0 && draft.dueDate.length > 0 && draft.reminderTime.length > 0, [draft]);

  return (
    <Modal
      visible={visible}
      title={mode === 'add' ? 'Add task' : 'Edit task'}
      description="Title, due date, reminder time, priority, repeat, and a motivation note are all stored locally."
      onClose={onClose}
      containerStyle={styles.modal}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Input
          label="Title"
          placeholder="Prepare weekly update"
          value={draft.title}
          onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))}
        />
        <Input
          label="Description"
          placeholder="Short description of the task"
          value={draft.description}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.multilineInput}
          onChangeText={(value) => setDraft((current) => ({ ...current, description: value }))}
        />

        <View style={styles.twoColumn}>
          <DatePicker label="Due date" value={draft.dueDate} onPress={() => setDatePickerVisible(true)} style={styles.flexItem} />
          <TimePicker label="Reminder time" value={draft.reminderTime} onPress={() => setTimePickerVisible(true)} style={styles.flexItem} />
        </View>

        <Text style={styles.sectionLabel}>Priority</Text>
        <View style={styles.pillRow}>
          {priorityOptions.map((priority) => {
            const selected = draft.priority === priority;

            return (
              <Button
                key={priority}
                title={TASK_PRIORITY_LABELS[priority]}
                size="small"
                variant={selected ? 'primary' : 'secondary'}
                leftIcon={<MaterialCommunityIcons name={selected ? 'check-circle' : 'radiobox-blank'} size={14} color={selected ? '#07111B' : appTheme.colors.textMuted} />}
                onPress={() => setDraft((current) => ({ ...current, priority }))}
              />
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Repeat</Text>
        <View style={styles.pillRow}>
          {repeatOptions.map((repeat) => {
            const selected = draft.repeat === repeat;

            return (
              <Button
                key={repeat}
                title={TASK_REPEAT_LABELS[repeat]}
                size="small"
                variant={selected ? 'primary' : 'ghost'}
                onPress={() => setDraft((current) => ({ ...current, repeat }))}
              />
            );
          })}
        </View>

        <Input
          label="Motivation note"
          placeholder="Keep it simple and finish strong."
          value={draft.motivationNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={styles.multilineInput}
          onChangeText={(value) => setDraft((current) => ({ ...current, motivationNote: value }))}
        />

        <View style={styles.actions}>
          <Button title="Cancel" variant="ghost" onPress={onClose} style={styles.actionButton} />
          <Button title={mode === 'add' ? 'Add task' : 'Save changes'} disabled={!canSubmit} onPress={() => onSubmit(draft)} style={styles.actionButton} />
        </View>
        {onPreviewComplete ? (
          <Button title="Preview completion quote" variant="secondary" onPress={onPreviewComplete} />
        ) : null}
      </ScrollView>

      <SimplePickerModal
        visible={datePickerVisible}
        title="Select due date"
        options={dateOptions}
        selectedValue={draft.dueDate}
        onClose={() => setDatePickerVisible(false)}
        onSelect={(value) => setDraft((current) => ({ ...current, dueDate: value }))}
      />
      <SimplePickerModal
        visible={timePickerVisible}
        title="Select reminder time"
        options={timeOptions}
        selectedValue={draft.reminderTime}
        onClose={() => setTimePickerVisible(false)}
        onSelect={(value) => setDraft((current) => ({ ...current, reminderTime: value }))}
      />
    </Modal>
  );
}

type SimplePickerModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

function SimplePickerModal({ visible, title, options, selectedValue, onClose, onSelect }: SimplePickerModalProps) {
  return (
    <Modal visible={visible} title={title} description="Choose a value for this task." onClose={onClose}>
      <View style={styles.pickerList}>
        {options.map((option) => {
          const selected = option === selectedValue;

          return (
            <Button
              key={option}
              title={option}
              variant={selected ? 'primary' : 'secondary'}
              leftIcon={<MaterialCommunityIcons name={selected ? 'check-circle' : 'circle-outline'} size={14} color={selected ? '#07111B' : appTheme.colors.textMuted} />}
              onPress={() => onSelect(option)}
              style={styles.pickerItem}
            />
          );
        })}
      </View>
    </Modal>
  );
}

const dateOptions = [
  'Today',
  'Tomorrow',
  'July 5, 2026',
  'July 6, 2026',
  'July 7, 2026',
  'July 8, 2026',
  'July 9, 2026',
];

const timeOptions = ['07:00 AM', '08:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '08:00 PM'];

const styles = StyleSheet.create({
  modal: {
    maxHeight: '92%',
  },
  content: {
    gap: appTheme.spacing.md,
    paddingBottom: appTheme.spacing.sm,
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 12,
  },
  twoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.md,
  },
  flexItem: {
    flexGrow: 1,
    flexBasis: 180,
  },
  sectionLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: appTheme.spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: appTheme.spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: 140,
  },
  pickerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  pickerItem: {
    flexGrow: 1,
    flexBasis: 140,
  },
});