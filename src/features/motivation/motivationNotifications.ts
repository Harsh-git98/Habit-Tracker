import type { MotivationQuote } from './motivationTypes';
import { formatQuote } from './motivationService';

export type MotivationNotificationContent = {
  title: string;
  body: string;
};

export function createMotivationNotificationContent(quote: MotivationQuote, taskTitle?: string): MotivationNotificationContent {
  return {
    title: taskTitle ? `Reminder: ${taskTitle}` : 'Daily motivation',
    body: formatQuote(quote),
  };
}
