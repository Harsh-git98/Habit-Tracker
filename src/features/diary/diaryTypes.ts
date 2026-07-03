export type DiaryMood = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired';

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: DiaryMood;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
};

export type DiaryDraft = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>;

export const DIARY_MOOD_LABELS: Record<DiaryMood, string> = {
  happy: '😊 Happy',
  neutral: '😐 Neutral',
  sad: '😔 Sad',
  angry: '😡 Angry',
  tired: '😴 Tired',
};

export const DIARY_MOOD_EMOJI: Record<DiaryMood, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  angry: '😡',
  tired: '😴',
};

export const DIARY_MOOD_ORDER: DiaryMood[] = ['happy', 'neutral', 'sad', 'angry', 'tired'];