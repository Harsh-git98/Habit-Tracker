import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../src/components/ui/AppScreen';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Input } from '../../src/components/ui/Input';
import { appTheme } from '../../src/theme/appTheme';
import { useAppSettings } from '../../src/features/settings/useAppSettings';
import { DEFAULT_REMINDER_PREFERENCES } from '../../src/features/settings/settingsTypes';

export default function SettingsScreen() {
  const { settings, reminderPreferences, updateWorkspaceName, updateReminderPreferences, resetReminderPreferences, isLoaded } = useAppSettings();
  const remindersSummary = useMemo(() => summarizePreferences(reminderPreferences), [reminderPreferences]);

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            A local-first control panel for workspace settings, reminder preferences, and storage state.
          </Text>
        </View>

        <Card title="Appearance" subtitle="Dark mode is the default and the visual language stays consistent throughout.">
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="weather-night" size={18} color={appTheme.colors.accent} />
            </View>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Dark theme</Text>
              <Text style={styles.settingSubtitle}>Enabled by default across the entire app.</Text>
            </View>
          </View>
          <Button title="Customize colors" variant="secondary" />
        </Card>

        <Card title="Workspace" subtitle="This app is intentionally local-first and keeps storage simple.">
          <View style={styles.workspaceRow}>
            <Card style={styles.miniCard}>
              <Text style={styles.miniValue}>{isLoaded ? 'Restored' : 'Loading'}</Text>
              <Text style={styles.miniLabel}>Storage</Text>
            </Card>
            <Card style={styles.miniCard}>
              <Text style={styles.miniValue}>Stable</Text>
              <Text style={styles.miniLabel}>Performance</Text>
            </Card>
          </View>
          <Input label="Default workspace name" placeholder="Daily Companion" value={settings.workspaceName} onChangeText={updateWorkspaceName} />
        </Card>

        <Card title="Reminder Preferences" subtitle="Stored locally and restored automatically on app restart.">
          <View style={styles.toggleGrid}>
            <PreferenceToggle
              label="Task reminders"
              enabled={reminderPreferences.taskRemindersEnabled}
              onPress={() => updateReminderPreferences({ taskRemindersEnabled: !reminderPreferences.taskRemindersEnabled })}
            />
            <PreferenceToggle
              label="Diary prompts"
              enabled={reminderPreferences.diaryPromptsEnabled}
              onPress={() => updateReminderPreferences({ diaryPromptsEnabled: !reminderPreferences.diaryPromptsEnabled })}
            />
            <PreferenceToggle
              label="Quote reminders"
              enabled={reminderPreferences.quoteRemindersEnabled}
              onPress={() => updateReminderPreferences({ quoteRemindersEnabled: !reminderPreferences.quoteRemindersEnabled })}
            />
            <PreferenceToggle
              label="Quiet hours"
              enabled={reminderPreferences.quietHoursEnabled}
              onPress={() => updateReminderPreferences({ quietHoursEnabled: !reminderPreferences.quietHoursEnabled })}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Lead time</Text>
              <Text style={styles.settingSubtitle}>Minutes before a task reminder should appear.</Text>
            </View>
            <Input
              value={String(reminderPreferences.taskReminderLeadTimeMinutes)}
              onChangeText={(value) => {
                const next = Number.parseInt(value, 10);
                updateReminderPreferences({ taskReminderLeadTimeMinutes: Number.isNaN(next) ? DEFAULT_REMINDER_PREFERENCES.taskReminderLeadTimeMinutes : next });
              }}
              keyboardType="number-pad"
              style={styles.inlineInput}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingTextBlock}>
              <Text style={styles.settingTitle}>Quiet hours</Text>
              <Text style={styles.settingSubtitle}>Soft boundaries for reminders and quote prompts.</Text>
            </View>
          </View>
          <View style={styles.timeRow}>
            <Input value={reminderPreferences.quietHoursStart} onChangeText={(value) => updateReminderPreferences({ quietHoursStart: value })} containerStyle={styles.timeInput} />
            <Input value={reminderPreferences.quietHoursEnd} onChangeText={(value) => updateReminderPreferences({ quietHoursEnd: value })} containerStyle={styles.timeInput} />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Saved summary</Text>
            <Text style={styles.summaryValue}>{remindersSummary}</Text>
          </View>
          <Button title="Reset reminder preferences" variant="secondary" onPress={resetReminderPreferences} />
        </Card>

        <EmptyState
          icon="palette-outline"
          title="All settings are local"
          description="Workspace name and reminder preferences are stored with AsyncStorage and restored automatically."
          actionLabel="Review UI"
        />
      </ScrollView>
    </AppScreen>
  );
}

function PreferenceToggle({ label, enabled, onPress }: { label: string; enabled: boolean; onPress: () => void }) {
  return (
    <Button
      title={label}
      variant={enabled ? 'primary' : 'secondary'}
      size="small"
      onPress={onPress}
      leftIcon={<MaterialCommunityIcons name={enabled ? 'check-circle' : 'circle-outline'} size={14} color={enabled ? '#07111B' : appTheme.colors.textMuted} />}
      style={styles.preferenceButton}
    />
  );
}

function summarizePreferences(preferences: typeof DEFAULT_REMINDER_PREFERENCES) {
  const parts = [
    preferences.taskRemindersEnabled ? 'tasks on' : 'tasks off',
    preferences.diaryPromptsEnabled ? 'diary on' : 'diary off',
    preferences.quoteRemindersEnabled ? 'quotes on' : 'quotes off',
  ];

  return `${parts.join(' · ')} · quiet ${preferences.quietHoursStart} to ${preferences.quietHoursEnd}`;
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.md,
    marginBottom: appTheme.spacing.md,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.accentSoft,
  },
  settingTextBlock: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  settingSubtitle: {
    color: appTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  workspaceRow: {
    flexDirection: 'row',
    gap: appTheme.spacing.md,
    flexWrap: 'wrap',
    marginBottom: appTheme.spacing.md,
  },
  miniCard: {
    flexGrow: 1,
    flexBasis: 140,
  },
  miniValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  miniLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
    marginTop: appTheme.spacing.xs,
  },
  preferenceButton: {
    flexGrow: 1,
    flexBasis: 150,
  },
  inlineInput: {
    minWidth: 96,
    flexBasis: 96,
    maxWidth: 120,
  },
  timeRow: {
    flexDirection: 'row',
    gap: appTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  timeInput: {
    flexGrow: 1,
    flexBasis: 140,
  },
  summaryRow: {
    gap: 6,
    padding: appTheme.spacing.md,
    borderRadius: appTheme.radius.lg,
    backgroundColor: appTheme.colors.tint,
  },
  summaryLabel: {
    color: appTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});