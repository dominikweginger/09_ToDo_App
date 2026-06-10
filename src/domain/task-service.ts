import { isBeforeDate, todayKey } from './date-utils';
import { DEFAULT_LIST_ID } from './list-model';
import { nextRecurrenceDate } from './recurrence-service';
import { Task, TaskDraft } from './task-model';
import { validateTaskDraft } from './task-validation';

export function createTask(draft: TaskDraft, forcedDate?: string, sortOrder = Date.now()): Task {
  const normalized = normalizeDraft(draft, forcedDate);
  const errors = validateTaskDraft(normalized);
  if (errors.length) throw new Error(errors.join(' '));

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: normalized.title.trim(),
    description: normalized.description.trim() || null,
    status: normalized.status,
    listId: normalized.listId || DEFAULT_LIST_ID,
    dueDate: normalized.dueDate || null,
    dueTime: normalized.dueTime || null,
    priority: normalized.priority,
    isFlagged: normalized.isFlagged,
    recurrence: normalized.recurrence?.enabled ? normalized.recurrence : null,
    sortOrder,
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
    listId: normalized.listId || DEFAULT_LIST_ID,
    dueDate: normalized.dueDate || null,
    dueTime: normalized.dueTime || null,
    priority: normalized.priority,
    isFlagged: normalized.isFlagged,
    recurrence: normalized.recurrence?.enabled ? normalized.recurrence : null,
    updatedAt: now,
    completedAt: nextStatus === 'done' ? task.completedAt ?? now : null
  };
}

export function toggleTaskDone(task: Task): Task {
  const now = new Date().toISOString();
  if (task.status !== 'done' && task.recurrence?.enabled && task.dueDate) {
    const nextDueDate = nextRecurrenceDate(task.dueDate, task.recurrence);
    if (nextDueDate) return { ...task, dueDate: nextDueDate, status: 'open', completedAt: null, updatedAt: now };
  }
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

export function sortListTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
}

export function normalizeTask(task: Partial<Task>, fallbackListId = DEFAULT_LIST_ID): Task {
  const now = new Date().toISOString();
  return {
    id: task.id ?? crypto.randomUUID(),
    title: task.title ?? '',
    description: task.description ?? null,
    status: task.status ?? 'open',
    listId: task.listId || fallbackListId,
    dueDate: task.dueDate ?? null,
    dueTime: task.dueTime ?? null,
    priority: task.priority ?? 'none',
    isFlagged: task.isFlagged ?? false,
    recurrence: task.recurrence ?? null,
    sortOrder: task.sortOrder ?? Date.now(),
    createdAt: task.createdAt ?? now,
    updatedAt: task.updatedAt ?? now,
    completedAt: task.completedAt ?? null
  };
}

function normalizeDraft(draft: TaskDraft, forcedDate?: string): TaskDraft {
  return {
    ...draft,
    dueDate: forcedDate ?? draft.dueDate,
    listId: draft.listId || DEFAULT_LIST_ID,
    isFlagged: draft.isFlagged ?? false,
    recurrence: draft.recurrence ?? null
  };
}
