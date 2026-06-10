import { Task, TaskRecurrence } from './task-model';

function addMonthsClamped(date: Date, amount: number): Date {
  const day = date.getDate();
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, maxDay));
  return next;
}

export function nextRecurrenceDate(dueDate: string, recurrence: TaskRecurrence): string | null {
  if (!recurrence.enabled || !recurrence.frequency) return null;
  const interval = Math.max(1, recurrence.interval || 1);
  const [year, month, day] = dueDate.split('-').map(Number);
  let next = new Date(year, month - 1, day);

  if (recurrence.frequency === 'daily') next.setDate(next.getDate() + interval);
  if (recurrence.frequency === 'weekly') next.setDate(next.getDate() + interval * 7);
  if (recurrence.frequency === 'monthly') next = addMonthsClamped(next, interval);
  if (recurrence.frequency === 'yearly') next = addMonthsClamped(next, interval * 12);

  const nextKey = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
  if (recurrence.endDate && nextKey > recurrence.endDate) return null;
  return nextKey;
}

export function hasActiveRecurrence(task: Task): boolean {
  return Boolean(task.recurrence?.enabled && task.recurrence.frequency && task.dueDate);
}
