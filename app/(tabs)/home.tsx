import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, useWindowDimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../src/components/ui/AppScreen';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { FloatingActionButton } from '../../src/components/ui/FloatingActionButton';
import { QuoteCard } from '../../src/components/ui/QuoteCard';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { appTheme } from '../../src/theme/appTheme';
import { formatQuote, getDailyMotivationQuote } from '../../src/features/motivation/motivationService';
import type { MotivationQuote } from '../../src/features/motivation/motivationTypes';
import { useTasks } from '../../src/features/tasks/useTasks';
import type { Task } from '../../src/features/tasks/taskTypes';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const twoColumn = width >= 720;
  const [dailyQuote, setDailyQuote] = useState<MotivationQuote | null>(null);
  const { pending, completed, isLoaded } = useTasks();
  const todayTitle = useMemo(() => formatTodayTitle(new Date()), []);
  const todayLabel = useMemo(() => formatTodayLabel(new Date()), []);
  const todaysPending = useMemo(() => filterTodayTasks(pending), [pending]);
  const todaysCompleted = useMemo(() => filterTodayTasks(completed), [completed]);
  const upcomingReminder = useMemo(() => getUpcomingReminder(todaysPending), [todaysPending]);
  const hasAnyTasks = pending.length > 0 || completed.length > 0;

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroOffset = useRef(new Animated.Value(16)).current;
  const quoteOpacity = useRef(new Animated.Value(0)).current;
  const quoteOffset = useRef(new Animated.Value(16)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentOffset = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    let active = true;

    getDailyMotivationQuote('home').then((quote) => {
      if (active) {
        setDailyQuote(quote);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.timing(heroOffset, {
          toValue: 0,
          duration: 360,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(quoteOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(quoteOffset, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(contentOffset, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [contentOffset, contentOpacity, heroOffset, heroOpacity, quoteOffset, quoteOpacity]);

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: heroOpacity, transform: [{ translateY: heroOffset }] }}>
          <Card tone="accent" style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroGreetingBlock}>
                <View style={styles.heroBadge}>
                  <MaterialCommunityIcons name="weather-night" size={16} color={appTheme.colors.accent} />
                  <Text style={styles.heroBadgeText}>Good {getGreeting()}</Text>
                </View>
                <Text style={styles.heroTitle}>Daily Companion</Text>
                <Text style={styles.heroSubtitle}>
                  Your calm command center for reminders, diary notes, and today’s progress.
                </Text>
              </View>
              <View style={styles.heroDateCard}>
                <Text style={styles.heroDateDay}>{todayTitle.day}</Text>
                <Text style={styles.heroDateMeta}>{todayLabel}</Text>
              </View>
            </View>
            <View style={[styles.actionRow, twoColumn && styles.actionRowWide]}>
              <QuickAction label="Quick Add Task" icon="checkbox-marked-circle-outline" onPress={() => router.push('/tasks')} />
              <QuickAction label="Quick Add Diary" icon="book-open-variant" onPress={() => router.push('/diary')} />
            </View>
          </Card>
        </Animated.View>

        <Animated.View style={{ opacity: quoteOpacity, transform: [{ translateY: quoteOffset }] }}>
          {dailyQuote ? <QuoteCard quote={dailyQuote.text} author={dailyQuote.author} label="Motivational quote" /> : null}
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentOffset }] }}>
          <View style={styles.statGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{todaysPending.length}</Text>
              <Text style={styles.statLabel}>Today's pending</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{todaysCompleted.length}</Text>
              <Text style={styles.statLabel}>Today's completed</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{upcomingReminder ? upcomingReminder.reminderTime : '--'}</Text>
              <Text style={styles.statLabel}>{upcomingReminder ? 'Upcoming reminder' : 'No reminders yet'}</Text>
            </Card>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today’s tasks</Text>
            <Text style={styles.sectionMeta}>{todayLabel}</Text>
          </View>

          {!isLoaded ? (
            <Card title="Loading dashboard" subtitle="Reading your local tasks and diary data.">
              <Text style={styles.loadingText}>Please wait...</Text>
            </Card>
          ) : !hasAnyTasks ? (
            <EmptyState
              icon="calendar-blank-outline"
              title="No tasks yet"
              description="Add your first task to unlock today’s pending tasks, completed tasks, and reminder timeline."
              actionLabel="Add a task"
              onActionPress={() => router.push('/tasks')}
            />
          ) : (
            <View style={styles.stack}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Pending Tasks</Text>
                <Text style={styles.sectionMeta}>{todaysPending.length}</Text>
              </View>
              {todaysPending.length === 0 ? (
                <Card title="All pending tasks are clear" subtitle="Nothing is waiting on you right now." />
              ) : (
                todaysPending.map((task) => <DashboardTaskCard key={task.id} task={task} completed={false} />)
              )}

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Completed Tasks</Text>
                <Text style={styles.sectionMeta}>{todaysCompleted.length}</Text>
              </View>
              {todaysCompleted.length === 0 ? (
                <Card title="No completed tasks yet" subtitle="Finished tasks will appear here as the day moves on." />
              ) : (
                todaysCompleted.map((task) => <DashboardTaskCard key={task.id} task={task} completed />)
              )}
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming reminder</Text>
            <Text style={styles.sectionMeta}>Next up</Text>
          </View>

          {upcomingReminder ? (
            <Card tone="raised" style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderIcon}>
                  <MaterialCommunityIcons name="alarm" size={18} color={appTheme.colors.accent} />
                </View>
                <View style={styles.reminderMetaBlock}>
                  <Text style={styles.reminderTitle}>{upcomingReminder.title}</Text>
                  <Text style={styles.reminderMeta}>
                    {upcomingReminder.dueDate} · {upcomingReminder.reminderTime}
                  </Text>
                </View>
              </View>
              <Text style={styles.reminderNote}>{upcomingReminder.motivationNote || 'You have one clear next step ready to go.'}</Text>
            </Card>
          ) : (
            <Card title="No upcoming reminder" subtitle="Add a task to see the next reminder appear here." />
          )}

          <View style={styles.quickRow}>
            <Button title="Quick Add Task" onPress={() => router.push('/tasks')} style={styles.quickButton} />
            <Button title="Quick Add Diary" variant="secondary" onPress={() => router.push('/diary')} style={styles.quickButton} />
          </View>
        </Animated.View>
      </ScrollView>
      <FloatingActionButton style={styles.fab} />
    </AppScreen>
  );
}

function QuickAction({ label, icon, onPress }: { label: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <MaterialCommunityIcons name={icon} size={18} color={appTheme.colors.textPrimary} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function DashboardTaskCard({ task, completed }: { task: Task; completed: boolean }) {
  return (
    <TaskCard
      title={task.title}
      time={task.reminderTime}
      note={task.description || task.motivationNote || 'Local reminder'}
      dueDate={task.dueDate}
      repeat={task.repeat}
      priority={task.priority}
      completed={completed}
      motivationNote={task.motivationNote || undefined}
    />
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'morning';
  }

  if (hour < 18) {
    return 'afternoon';
  }

  return 'evening';
}

function formatTodayTitle(date: Date) {
  return {
    day: date.toLocaleDateString([], { day: '2-digit' }),
    month: date.toLocaleDateString([], { month: 'short' }),
  };
}

function formatTodayLabel(date: Date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function normalizeDateText(value: string) {
  return value.trim().toLowerCase();
}

function filterTodayTasks(tasks: Task[]) {
  const today = new Date();
  const todayLabel = today.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }).toLowerCase();
  const todayShort = today.toLocaleDateString([], { month: 'short', day: 'numeric' }).toLowerCase();
  const isoToday = today.toISOString().slice(0, 10);

  return tasks.filter((task) => {
    const dueDate = normalizeDateText(task.dueDate);

    return dueDate === 'today' || dueDate === todayLabel || dueDate === todayShort || dueDate === isoToday;
  });
}

function getUpcomingReminder(tasks: Task[]) {
  return [...tasks].sort((left, right) => {
    const leftKey = `${left.dueDate} ${left.reminderTime}`.toLowerCase();
    const rightKey = `${right.dueDate} ${right.reminderTime}`.toLowerCase();
    return leftKey.localeCompare(rightKey);
  })[0];
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
    gap: appTheme.spacing.lg,
  },
  heroCard: {
    minHeight: 0,
  },
  heroGreetingBlock: {
    flex: 1,
    gap: appTheme.spacing.sm,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: appTheme.radius.full,
    backgroundColor: 'rgba(142, 214, 255, 0.12)',
  },
  heroBadgeText: {
    color: appTheme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroDateCard: {
    minWidth: 86,
    minHeight: 86,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroDateDay: {
    color: appTheme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  heroDateMeta: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: appTheme.typography.hero,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: appTheme.spacing.sm,
  },
  heroSubtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 620,
  },
  actionRow: {
    flexDirection: 'column',
    gap: appTheme.spacing.sm,
  },
  actionRowWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    minWidth: 150,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.md,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 140,
  },
  statValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  statLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
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
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  stack: {
    gap: appTheme.spacing.md,
  },
  reminderCard: {
    minHeight: 0,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: appTheme.spacing.md,
  },
  reminderIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.accentSoft,
  },
  reminderMetaBlock: {
    flex: 1,
    gap: 4,
  },
  reminderTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  reminderMeta: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  reminderNote: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: appTheme.spacing.md,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
  },
  quickButton: {
    flexGrow: 1,
    flexBasis: 160,
  },
  quickAction: {
    flexGrow: 1,
    flexBasis: 160,
    minHeight: 54,
    borderRadius: appTheme.radius.full,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.borderStrong,
    paddingHorizontal: appTheme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...appTheme.shadows.button,
  },
  quickActionLabel: {
    color: appTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
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