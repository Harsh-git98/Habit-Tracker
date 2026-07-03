import type { MotivationQuote } from './motivationTypes';
import { readJSON, writeJSON } from '../../services/storage/storageService';

const MOTIVATION_CACHE_KEY = 'daily-companion/motivation-cache/v1';
const DAILY_QUOTE_KEY = 'daily-companion/motivation-daily/v1';

type MotivationCache = {
  quotes: MotivationQuote[];
  updatedAt: string;
};

type DailyQuoteCache = {
  dateKey: string;
  quote: MotivationQuote;
};

export async function loadQuoteCache(): Promise<MotivationCache | null> {
  return readJSON<MotivationCache>(MOTIVATION_CACHE_KEY);
}

export async function saveQuoteCache(quotes: MotivationQuote[]): Promise<void> {
  const payload: MotivationCache = {
    quotes,
    updatedAt: new Date().toISOString(),
  };

  await writeJSON(MOTIVATION_CACHE_KEY, payload);
}

export async function loadDailyQuote(dateKey: string): Promise<MotivationQuote | null> {
  const parsed = await readJSON<DailyQuoteCache>(DAILY_QUOTE_KEY);
  return parsed?.dateKey === dateKey ? parsed.quote : null;
}

export async function saveDailyQuote(dateKey: string, quote: MotivationQuote): Promise<void> {
  const payload: DailyQuoteCache = { dateKey, quote };
  await writeJSON(DAILY_QUOTE_KEY, payload);
}
