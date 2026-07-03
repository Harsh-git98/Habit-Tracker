export type ReminderPreferences = {
  taskRemindersEnabled: boolean;
  diaryPromptsEnabled: boolean;
  quoteRemindersEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  taskReminderLeadTimeMinutes: number;
};

export type AppSettings = {
  workspaceName: string;
  reminderPreferences: ReminderPreferences;
  updatedAt: string;
  createdAt: string;
};

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  taskRemindersEnabled: true,
  diaryPromptsEnabled: true,
  quoteRemindersEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '10:00 PM',
  quietHoursEnd: '07:00 AM',
  taskReminderLeadTimeMinutes: 15,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  workspaceName: 'Daily Companion',
  reminderPreferences: DEFAULT_REMINDER_PREFERENCES,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};