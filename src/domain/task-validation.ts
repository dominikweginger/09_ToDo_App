import { DEFAULT_LIST_ID } from './list-model';
import { PRIORITIES, STATUSES, Task, TaskDraft } from './task-model';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateTaskDraft(draft: TaskDraft): string[] {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push('Der Titel ist erforderlich.');
  if (!draft.listId.trim()) errors.push('Die Liste ist erforderlich.');
  if (draft.dueDate && !DATE_PATTERN.test(draft.dueDate)) errors.push('Das Datum ist ungueltig.');
  if (draft.dueTime && !TIME_PATTERN.test(draft.dueTime)) errors.push('Die Uhrzeit ist ungueltig.');
  if (!PRIORITIES.includes(draft.priority)) errors.push('Die Prioritaet ist ungueltig.');
  if (!STATUSES.includes(draft.status)) errors.push('Der Status ist ungueltig.');
  if (draft.recurrence?.enabled) {
    if (!draft.recurrence.frequency) errors.push('Die Wiederholung ist ungueltig.');
    if (!Number.isFinite(draft.recurrence.interval) || draft.recurrence.interval < 1) errors.push('Das Wiederholungsintervall ist ungueltig.');
  }
  return errors;
}

export function validateImportedTask(task: unknown): task is Task {
  if (!task || typeof task !== 'object') return false;
  const candidate = task as Partial<Task>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    STATUSES.includes(candidate.status as Task['status']) &&
    PRIORITIES.includes(candidate.priority as Task['priority']) &&
    typeof (candidate.listId ?? DEFAULT_LIST_ID) === 'string' &&
    typeof (candidate.isFlagged ?? false) === 'boolean' &&
    typeof (candidate.sortOrder ?? 0) === 'number' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    (candidate.dueDate === null || typeof candidate.dueDate === 'string') &&
    (candidate.dueTime === null || typeof candidate.dueTime === 'string') &&
    (candidate.description === null || typeof candidate.description === 'string')
  );
}
