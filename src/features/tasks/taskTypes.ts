export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'weekdays' | 'custom';

export type TaskSort = 'dueDate' | 'priority';
export type TaskStatus = 'pending' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  reminderTime: string;
  priority: TaskPriority;
  repeat: TaskRepeat;
  motivationNote: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskDraft = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>;

export const TASK_SORT_LABELS: Record<TaskSort, string> = {
  dueDate: 'Due Date',
  priority: 'Priority',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const TASK_REPEAT_LABELS: Record<TaskRepeat, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  weekdays: 'Weekdays',
  custom: 'Custom',
};

export const TASK_PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};