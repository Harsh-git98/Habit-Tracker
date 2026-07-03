import { useMemo, useState } from 'react';
import { useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../src/components/ui/AppScreen';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { Input } from '../../src/components/ui/Input';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { TaskFormModal } from '../../src/features/tasks/TaskFormModal';
import { useTasks } from '../../src/features/tasks/useTasks';
import type { Task, TaskDraft, TaskSort } from '../../src/features/tasks/taskTypes';
import { TASK_SORT_LABELS } from '../../src/features/tasks/taskTypes';
import { appTheme } from '../../src/theme/appTheme';
import { createMotivationNotificationContent } from '../../src/features/motivation/motivationNotifications';
import { getCompletionMotivationQuote } from '../../src/features/motivation/motivationService';

export default function TasksScreen() {
  const { width } = useWindowDimensions();
  const sideBySide = width >= 720;
  const { pending, completed, sortBy, setSortBy, addTask, updateTask, deleteTask, markTask, resetDraft, isLoaded } = useTasks();
  const [composerVisible, setComposerVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredPending = useMemo(() => filterTasks(pending, query), [pending, query]);
  const filteredCompleted = useMemo(() => filterTasks(completed, query), [completed, query]);

  const openAddModal = () => {
    setEditingTask(null);
    setComposerVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setComposerVisible(true);
  };

  const closeModal = () => {
    setComposerVisible(false);
    setEditingTask(null);
  };

  const submitTask = (draft: TaskDraft) => {
    if (editingTask) {
      updateTask(editingTask.id, draft);
    } else {
      addTask(draft);
    }

    closeModal();
  };

  const draft = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description,
        dueDate: editingTask.dueDate,
        reminderTime: editingTask.reminderTime,
        priority: editingTask.priority,
        repeat: editingTask.repeat,
        motivationNote: editingTask.motivationNote,
      }
    : resetDraft();

  const handleCompletionToggle = async (task: Task) => {
    const nextCompleted = !task.completed;
    markTask(task.id, nextCompleted);

    if (nextCompleted) {
      const quote = await getCompletionMotivationQuote(task.id);
      const content = createMotivationNotificationContent(quote, task.title);
      console.log(content.title, content.body);
    }
  };

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>
            Add, edit, sort, complete, and store reminders locally with a polished dark interface.
          </Text>
        </View>

        <Input label="Search tasks" leftIcon="magnify" placeholder="Search by title or note" value={query} onChangeText={setQuery} />

        <View style={styles.filterRow}>
          <Button title="All" size="small" variant={statusFilter === 'all' ? 'primary' : 'secondary'} onPress={() => setStatusFilter('all')} />
          <Button title="Pending" size="small" variant={statusFilter === 'pending' ? 'primary' : 'secondary'} onPress={() => setStatusFilter('pending')} />
          <Button title="Completed" size="small" variant={statusFilter === 'completed' ? 'primary' : 'secondary'} onPress={() => setStatusFilter('completed')} />
        </View>

        <View style={styles.filterRow}>
          <Button title={`Sort: ${TASK_SORT_LABELS[sortBy]}`} size="small" variant="ghost" onPress={() => setSortBy(sortBy === 'dueDate' ? 'priority' : 'dueDate')} />
        </View>

        <View style={[styles.twoColumn, sideBySide && styles.twoColumnWide]}>
          <View style={styles.column}>
            <SectionHeader title="Pending tasks" count={filteredPending.length} />
            {!isLoaded ? <LoadingState /> : filteredPending.length === 0 ? <EmptyTaskState title="No pending tasks" description="Create a new reminder to start filling this space." onAdd={openAddModal} /> : filteredPending.map(renderTaskRow(openEditModal, handleCompletionToggle, deleteTask))}
          </View>

          <View style={styles.column}>
            <SectionHeader title="Completed tasks" count={filteredCompleted.length} />
            {!isLoaded ? <LoadingState /> : filteredCompleted.length === 0 ? <EmptyState icon="checkbox-marked-circle-outline" title="Nothing completed yet" description="Completed reminders will appear here as you finish them." actionLabel="Add task" onActionPress={openAddModal} /> : filteredCompleted.map(renderTaskRow(openEditModal, handleCompletionToggle, deleteTask))}

            <Card title="Task flow" subtitle="Task creation and review stay calm, quick, and local-first.">
              <View style={styles.flow}>
                <View style={styles.flowItem}>
                  <Text style={styles.flowValue}>1</Text>
                  <Text style={styles.flowLabel}>Add details</Text>
                </View>
                <View style={styles.flowItem}>
                  <Text style={styles.flowValue}>2</Text>
                  <Text style={styles.flowLabel}>Choose schedule</Text>
                </View>
                <View style={styles.flowItem}>
                  <Text style={styles.flowValue}>3</Text>
                  <Text style={styles.flowLabel}>Store locally</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>

      <FloatingActionButton onPress={openAddModal} style={styles.fab} />
      <TaskFormModal
        visible={composerVisible}
        mode={editingTask ? 'edit' : 'add'}
        initialValues={draft}
        onClose={closeModal}
        onSubmit={submitTask}
      />
    </AppScreen>
  );
}

function filterTasks(tasks: Task[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return tasks;
  }

  return tasks.filter((task) => {
    const haystack = `${task.title} ${task.description} ${task.motivationNote} ${task.dueDate} ${task.reminderTime}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

function renderTaskRow(
  onEdit: (task: Task) => void,
  onMark: (task: Task) => void,
  onDelete: (taskId: string) => void,
) {
  return (task: Task) => (
    <TaskRow key={task.id} task={task} onEdit={onEdit} onMark={onMark} onDelete={onDelete} />
  );
}

type TaskRowProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onMark: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

function TaskRow({ task, onEdit, onMark, onDelete }: TaskRowProps) {
  return (
    <TaskCard
      title={task.title}
      time={task.reminderTime}
      note={`${task.description}${task.motivationNote ? ` • ${task.motivationNote}` : ''}`}
      priority={task.priority}
      completed={task.completed}
      onPress={() => onEdit(task)}
      onCompleteToggle={() => onMark(task)}
      onEdit={() => onEdit(task)}
      onDelete={() => onDelete(task.id)}
      dueDate={task.dueDate}
      repeat={task.repeat}
      motivationNote={task.motivationNote || undefined}
    />
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );
}

function LoadingState() {
  return (
    <Card title="Loading tasks" subtitle="Reading your local task storage.">
      <Text style={styles.loadingText}>Please wait...</Text>
    </Card>
  );
}

function EmptyTaskState({ title, description, onAdd }: { title: string; description: string; onAdd: () => void }) {
  return <EmptyState icon="calendar-star" title={title} description={description} actionLabel="Add task" onActionPress={onAdd} />;
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
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
  sectionCount: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
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
  flow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
    marginTop: appTheme.spacing.sm,
  },
  flowItem: {
    flexGrow: 1,
    flexBasis: 100,
    padding: appTheme.spacing.md,
    borderRadius: appTheme.radius.lg,
    backgroundColor: appTheme.colors.tint,
    gap: 6,
  },
  flowValue: {
    color: appTheme.colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  flowLabel: {
    color: appTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
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