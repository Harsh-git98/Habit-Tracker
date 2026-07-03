import quotes from './quotes.json';
import type { MotivationQuote, MotivationQuoteContext } from './motivationTypes';
import { loadDailyQuote, loadQuoteCache, saveDailyQuote, saveQuoteCache } from './motivationStorage';

const FALLBACK_QUOTE: MotivationQuote = {
  text: 'Small progress is still progress.',
  author: 'Unknown',
};

const quotePool: MotivationQuote[] = quotes.length > 0 ? (quotes as MotivationQuote[]) : [FALLBACK_QUOTE];

export async function hydrateMotivationQuotes() {
  const cached = await loadQuoteCache();

  if (cached?.quotes?.length) {
    return cached.quotes;
  }

  await saveQuoteCache(quotePool);
  return quotePool;
}

export async function getDailyMotivationQuote(context: MotivationQuoteContext = 'home') {
  const dateKey = createDateKey(new Date());
  const cached = await loadDailyQuote(dateKey);

  if (cached) {
    return cached;
  }

  const quotesToUse = await hydrateMotivationQuotes();
  const quote = selectQuote(quotesToUse, dateKey, context);

  await saveDailyQuote(dateKey, quote);
  return quote;
}

export async function getMotivationQuoteForNotification(seed: string) {
  const quotesToUse = await hydrateMotivationQuotes();
  return selectQuote(quotesToUse, seed, 'notification');
}

export async function getCompletionMotivationQuote(seed: string) {
  const quotesToUse = await hydrateMotivationQuotes();
  return selectQuote(quotesToUse, seed, 'completion');
}

export function formatQuote(quote: MotivationQuote) {
  return quote.author ? `${quote.text} — ${quote.author}` : quote.text;
}

function selectQuote(quotesToUse: MotivationQuote[], seed: string, context: MotivationQuoteContext) {
  if (!quotesToUse.length) {
    return FALLBACK_QUOTE;
  }

  const hash = hashString(`${context}:${seed}`);
  return quotesToUse[hash % quotesToUse.length] ?? FALLBACK_QUOTE;
}

function createDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}
