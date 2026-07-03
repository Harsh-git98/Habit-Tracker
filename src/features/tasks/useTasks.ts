import { useEffect, useMemo, useState } from 'react';

import { loadTasks, saveTasks } from './taskStorage';
import type { Task, TaskDraft, TaskPriority, TaskSort } from './taskTypes';
import { createTaskId, sortTasks, splitTasksByCompletion } from './taskUtils';

const FALLBACK_DRAFT: TaskDraft = {
  title: '',
  description: '',
  dueDate: '',
  reminderTime: '',
  priority: 'medium',
  repeat: 'none',
  motivationNote: '',
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<TaskSort>('dueDate');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadTasks().then((storedTasks) => {
      if (!mounted) {
        return;
      }

      setTasks(storedTasks);
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

    void saveTasks(tasks);
  }, [isLoaded, tasks]);

  const sortedTasks = useMemo(() => sortTasks(tasks, sortBy), [sortBy, tasks]);
  const { pending, completed } = useMemo(() => splitTasksByCompletion(sortedTasks), [sortedTasks]);

  const addTask = (draft: TaskDraft) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: createTaskId(),
      ...draft,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  };

  const updateTask = (taskId: string, draft: TaskDraft) => {
    const updatedAt = new Date().toISOString();

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...draft,
              updatedAt,
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const markTask = (taskId: string, completed: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const resetDraft = (): TaskDraft => ({ ...FALLBACK_DRAFT });

  return {
    tasks: sortedTasks,
    pending,
    completed,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    deleteTask,
    markTask,
    resetDraft,
    isLoaded,
  };
}