export type TaskStatus = 'open' | 'done' | 'archived';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TaskRecurrence {
  enabled: boolean;
  frequency?: RecurrenceFrequency;
  interval: number;
  endDate?: string | null;
  advanceMode: 'scheduledDate';
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  listId: string;
  dueDate: string | null;
  dueTime: string | null;
  priority: TaskPriority;
  isFlagged: boolean;
  recurrence: TaskRecurrence | null;
  sortOrder: number;
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
  listId: string;
  isFlagged: boolean;
  recurrence: TaskRecurrence | null;
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
