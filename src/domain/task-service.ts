import { isBeforeDate, todayKey } from './date-utils';
import { Task, TaskDraft } from './task-model';
import { validateTaskDraft } from './task-validation';

export function createTask(draft: TaskDraft, forcedDate?: string): Task {
  const normalized = normalizeDraft(draft, forcedDate);
  const errors = validateTaskDraft(normalized);
  if (errors.length) throw new Error(errors.join(' '));

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: normalized.title.trim(),
    description: normalized.description.trim() || null,
    status: normalized.status,
    dueDate: normalized.dueDate || null,
    dueTime: normalized.dueTime || null,
    priority: normalized.priority,
    categoryId: null,
    tags: [],
    isRecurring: false,
    recurrenceRule: null,
    createdAt: now,
    updatedAt: now,
    completedAt: normalized.status === 'done' ? now : null
  };
}

export function updateTask(task: Task, draft: TaskDraft): Task {
  const normalized = normalizeDraft(draft);
  const errors = validateTaskDraft(normalized);
  if (errors.length) throw new Error(errors.join(' '));

  const now = new Date().toISOString();
  const nextStatus = normalized.status;
  return {
    ...task,
    title: normalized.title.trim(),
    description: normalized.description.trim() || null,
    status: nextStatus,
    dueDate: normalized.dueDate || null,
    dueTime: normalized.dueTime || null,
    priority: normalized.priority,
    updatedAt: now,
    completedAt: nextStatus === 'done' ? task.completedAt ?? now : null
  };
}

export function toggleTaskDone(task: Task): Task {
  const now = new Date().toISOString();
  const done = task.status !== 'done';
  return {
    ...task,
    status: done ? 'done' : 'open',
    completedAt: done ? now : null,
    updatedAt: now
  };
}

export function moveTaskToDate(task: Task, dueDate: string | null): Task {
  return { ...task, dueDate, updatedAt: new Date().toISOString() };
}

export function isOverdue(task: Task, reference = todayKey()): boolean {
  return task.status === 'open' && Boolean(task.dueDate) && isBeforeDate(task.dueDate!, reference);
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const dateSort = (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31');
    if (dateSort !== 0) return dateSort;
    const timeSort = (a.dueTime ?? '99:99').localeCompare(b.dueTime ?? '99:99');
    if (timeSort !== 0) return timeSort;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

function normalizeDraft(draft: TaskDraft, forcedDate?: string): TaskDraft {
  return {
    ...draft,
    dueDate: forcedDate ?? draft.dueDate
  };
}
