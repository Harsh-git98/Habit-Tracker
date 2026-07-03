import type { DiaryEntry } from './diaryTypes';
import { readList, writeList } from '../../services/storage/storageService';

const DIARY_STORAGE_KEY = 'daily-companion/diary/v1';

export async function loadDiaryEntries(): Promise<DiaryEntry[]> {
  return readList<DiaryEntry>(DIARY_STORAGE_KEY);
}

export async function saveDiaryEntries(entries: DiaryEntry[]): Promise<void> {
  await writeList(DIARY_STORAGE_KEY, entries);
}