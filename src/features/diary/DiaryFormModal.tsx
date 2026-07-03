import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { appTheme } from '../../theme/appTheme';
import type { DiaryDraft, DiaryMood } from './diaryTypes';
import { DIARY_MOOD_LABELS } from './diaryTypes';

type DiaryFormModalProps = {
  visible: boolean;
  initialValues: DiaryDraft;
  mode: 'add' | 'edit';
  onClose: () => void;
  onSubmit: (draft: DiaryDraft) => void;
};

const moodOptions: DiaryMood[] = ['happy', 'neutral', 'sad', 'angry', 'tired'];

export function DiaryFormModal({ visible, initialValues, mode, onClose, onSubmit }: DiaryFormModalProps) {
  const [draft, setDraft] = useState<DiaryDraft>(initialValues);

  useEffect(() => {
    setDraft(initialValues);
  }, [initialValues, visible]);

  const canSubmit = useMemo(() => draft.title.trim().length > 0 && draft.content.trim().length > 0, [draft]);

  return (
    <Modal
      visible={visible}
      title={mode === 'add' ? 'Create diary entry' : 'Edit diary entry'}
      description="Title, content, timestamp, and mood are all stored locally on the device."
      onClose={onClose}
      containerStyle={styles.modal}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Input
          label="Title"
          placeholder="What stood out today?"
          value={draft.title}
          onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))}
        />

        <Input
          label="Content"
          placeholder="Write the full entry here..."
          value={draft.content}
          multiline
          numberOfLines={7}
          textAlignVertical="top"
          style={styles.multilineInput}
          onChangeText={(value) => setDraft((current) => ({ ...current, content: value }))}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Mood</Text>
        </View>
        <View style={styles.moodGrid}>
          {moodOptions.map((mood) => {
            const selected = draft.mood === mood;

            return (
              <Button
                key={mood}
                title={DIARY_MOOD_LABELS[mood]}
                size="small"
                variant={selected ? 'primary' : 'secondary'}
                leftIcon={<MaterialCommunityIcons name={selected ? 'check-circle' : 'emoticon-outline'} size={14} color={selected ? '#07111B' : appTheme.colors.textMuted} />}
                onPress={() => setDraft((current) => ({ ...current, mood }))}
                style={styles.moodButton}
              />
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button title="Cancel" variant="ghost" onPress={onClose} style={styles.actionButton} />
          <Button title={mode === 'add' ? 'Save entry' : 'Update entry'} disabled={!canSubmit} onPress={() => onSubmit(draft)} style={styles.actionButton} />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    maxHeight: '92%',
  },
  content: {
    gap: appTheme.spacing.md,
    paddingBottom: appTheme.spacing.sm,
  },
  multilineInput: {
    minHeight: 180,
    paddingTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  moodButton: {
    flexGrow: 1,
    flexBasis: 140,
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
});