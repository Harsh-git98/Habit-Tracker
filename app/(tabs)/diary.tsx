import { useMemo, useState } from 'react';
import { useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../src/components/ui/AppScreen';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { DiaryEntryCard } from '../../src/components/ui/DiaryEntryCard';
import { appTheme } from '../../src/theme/appTheme';
import { DiaryFormModal } from '../../src/features/diary/DiaryFormModal';
import { useDiaryEntries } from '../../src/features/diary/useDiaryEntries';
import type { DiaryDraft, DiaryEntry } from '../../src/features/diary/diaryTypes';
import { createDiaryDraft } from '../../src/features/diary/diaryUtils';

export default function DiaryScreen() {
  const { width } = useWindowDimensions();
  const sideBySide = width >= 720;
  const { entries, addEntry, updateEntry, deleteEntry, resetDraft, isLoaded } = useDiaryEntries();
  const [composerVisible, setComposerVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);
  const draft = editingEntry
    ? {
        title: editingEntry.title,
        content: editingEntry.content,
        mood: editingEntry.mood,
        timestamp: editingEntry.timestamp,
      }
    : resetDraft();

  const openAddModal = () => {
    setEditingEntry(null);
    setComposerVisible(true);
  };

  const openEditModal = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setComposerVisible(true);
  };

  const closeModal = () => {
    setComposerVisible(false);
    setEditingEntry(null);
  };

  const submitEntry = (entryDraft: DiaryDraft) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, entryDraft);
    } else {
      addEntry(entryDraft);
    }

    closeModal();
  };

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Diary</Text>
          <Text style={styles.subtitle}>
            A quiet, premium journal space built for short reflections, long thoughts, and everything in between.
          </Text>
        </View>

        <Card title="Write a moment" subtitle="This is a visual composer for your daily notes.">
          <View style={styles.buttonRow}>
            <Button title="New entry" style={styles.rowButton} onPress={openAddModal} />
            <Button title="How it works" variant="secondary" style={styles.rowButton} />
          </View>
        </Card>

        <View style={[styles.twoColumn, sideBySide && styles.twoColumnWide]}>
          <View style={styles.column}>
            <SectionHeader title="Recent entries" count={entries.length} />
            {!isLoaded ? (
              <LoadingState />
            ) : recentEntries.length === 0 ? (
              <EmptyState
                icon="book-open-page-variant-outline"
                title="No diary entries yet"
                description="Start with a single thought, then come back and refine it later."
                actionLabel="Create entry"
                onActionPress={openAddModal}
              />
            ) : (
              recentEntries.map((entry) => (
                <DiaryEntryCard
                  key={entry.id}
                  title={entry.title}
                  content={entry.content}
                  timestampLabel={formatTimestamp(entry.timestamp)}
                  mood={entry.mood}
                  onPress={() => openEditModal(entry)}
                  onEdit={() => openEditModal(entry)}
                  onDelete={() => deleteEntry(entry.id)}
                />
              ))
            )}
          </View>

          <View style={styles.column}>
            <Card title="Empty entry state" subtitle="Ready for days when there is nothing written yet.">
              <View style={styles.emptyIllustration}>
                <Text style={styles.emptyNumber}>{entries.length}</Text>
                <Text style={styles.emptyLabel}>local entries</Text>
              </View>
            </Card>
            <Button title="New journal entry" variant="ghost" onPress={openAddModal} />
            <EmptyState
              icon="emoticon-happy-outline"
              title="Mood-led writing"
              description="Choose one of five moods, then save the entry locally in reverse chronological order."
              actionLabel="Add entry"
              onActionPress={openAddModal}
            />
          </View>
        </View>
      </ScrollView>

      <FloatingActionButton icon="lead-pencil" onPress={openAddModal} style={styles.fab} />
      <DiaryFormModal visible={composerVisible} initialValues={draft} mode={editingEntry ? 'edit' : 'add'} onClose={closeModal} onSubmit={submitEntry} />
    </AppScreen>
  );
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{count}</Text>
    </View>
  );
}

function LoadingState() {
  return (
    <Card title="Loading diary" subtitle="Reading your local journal entries.">
      <Text style={styles.loadingText}>Please wait...</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
    gap: appTheme.spacing.lg,
  },
  headerBlock: {
    gap: 8,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.hero,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  subtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  noteInput: {
    minHeight: 138,
    paddingTop: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  rowButton: {
    minWidth: 140,
  },
  twoColumn: {
    gap: appTheme.spacing.md,
  },
  twoColumnWide: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    gap: appTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionMeta: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyIllustration: {
    minHeight: 140,
    borderRadius: appTheme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  emptyNumber: {
    color: appTheme.colors.textPrimary,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  emptyLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  loadingText: {
    color: appTheme.colors.textSecondary,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: appTheme.spacing.lg,
    bottom: 104,
  },
});