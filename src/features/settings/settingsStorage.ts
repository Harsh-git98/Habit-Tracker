import { readJSON, writeJSON } from '../../services/storage/storageService';
import { DEFAULT_APP_SETTINGS, type AppSettings } from './settingsTypes';

const SETTINGS_STORAGE_KEY = 'daily-companion/settings/v1';

export async function loadAppSettings(): Promise<AppSettings> {
  const stored = await readJSON<AppSettings>(SETTINGS_STORAGE_KEY);
  return stored ?? DEFAULT_APP_SETTINGS;
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await writeJSON(SETTINGS_STORAGE_KEY, settings);
}