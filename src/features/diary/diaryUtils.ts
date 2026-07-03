import type { DiaryEntry, DiaryMood, DiaryDraft } from './diaryTypes';
import { DIARY_MOOD_ORDER } from './diaryTypes';

export function createDiaryId() {
  return `diary-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sortDiaryEntries(entries: DiaryEntry[]) {
  return [...entries].sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
}

export function moodRank(mood: DiaryMood) {
  return DIARY_MOOD_ORDER.indexOf(mood);
}

export function createDiaryDraft(): DiaryDraft {
  return {
    title: '',
    content: '',
    mood: 'neutral',
    timestamp: new Date().toISOString(),
  };
}
