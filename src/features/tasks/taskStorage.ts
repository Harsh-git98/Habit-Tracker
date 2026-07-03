import type { Task } from './taskTypes';
import { readList, writeList } from '../../services/storage/storageService';

const TASKS_STORAGE_KEY = 'daily-companion/tasks/v1';

export async function loadTasks(): Promise<Task[]> {
  return readList<Task>(TASKS_STORAGE_KEY);
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await writeList(TASKS_STORAGE_KEY, tasks);
}