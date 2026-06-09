export type TaskStatus = 'open' | 'done' | 'archived';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  dueTime: string | null;
  priority: TaskPriority;
  categoryId: string | null;
  tags: string[];
  isRecurring: false;
  recurrenceRule: null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskDraft {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const PRIORITIES: TaskPriority[] = ['none', 'low', 'medium', 'high'];
export const STATUSES: TaskStatus[] = ['open', 'done', 'archived'];

export const priorityLabel: Record<TaskPriority, string> = {
  none: 'Keine',
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch'
};
