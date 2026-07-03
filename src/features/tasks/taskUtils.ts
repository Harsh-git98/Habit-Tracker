import { TASK_PRIORITY_ORDER, type Task, type TaskPriority, type TaskSort } from './taskTypes';

export function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getPriorityLabel(priority: TaskPriority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function sortTasks(tasks: Task[], sortBy: TaskSort) {
  return [...tasks].sort((left, right) => {
    if (sortBy === 'priority') {
      const priorityDiff = TASK_PRIORITY_ORDER[left.priority] - TASK_PRIORITY_ORDER[right.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
    }

    const dateDiff = new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return TASK_PRIORITY_ORDER[left.priority] - TASK_PRIORITY_ORDER[right.priority];
  });
}

export function splitTasksByCompletion(tasks: Task[]) {
  return {
    pending: tasks.filter((task) => !task.completed),
    completed: tasks.filter((task) => task.completed),
  };
}
