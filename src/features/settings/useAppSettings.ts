import { useEffect, useMemo, useState } from 'react';

import { loadAppSettings, saveAppSettings } from './settingsStorage';
import { DEFAULT_APP_SETTINGS, DEFAULT_REMINDER_PREFERENCES, type AppSettings, type ReminderPreferences } from './settingsTypes';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadAppSettings().then((storedSettings) => {
      if (!mounted) {
        return;
      }

      setSettings(storedSettings);
      setIsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void saveAppSettings(settings);
  }, [isLoaded, settings]);

  const reminderPreferences = useMemo(() => settings.reminderPreferences, [settings.reminderPreferences]);

  const updateWorkspaceName = (workspaceName: string) => {
    setSettings((current) => ({
      ...current,
      workspaceName,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateReminderPreferences = (updates: Partial<ReminderPreferences>) => {
    setSettings((current) => ({
      ...current,
      reminderPreferences: {
        ...current.reminderPreferences,
        ...updates,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetReminderPreferences = () => {
    updateReminderPreferences(DEFAULT_REMINDER_PREFERENCES);
  };

  return {
    settings,
    reminderPreferences,
    updateWorkspaceName,
    updateReminderPreferences,
    resetReminderPreferences,
    isLoaded,
  };
}