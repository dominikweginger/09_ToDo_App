import { todayKey } from './date-utils';
import { Task } from './task-model';
import { isOverdue, sortTasks } from './task-service';
import { addDays, isInWeek, startOfWeek } from './week-utils';

export type SmartViewKey = 'today' | 'planned' | 'this-week' | 'next-week' | 'flagged' | 'urgent';

export const smartViewLabels: Record<SmartViewKey, string> = {
  today: 'Heute',
  planned: 'Geplant',
  'this-week': 'Diese Woche',
  'next-week': 'Naechste Woche',
  flagged: 'Markiert',
  urgent: 'Dringend'
};

export function openVisibleTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status === 'open');
}

export function getSmartViewTasks(tasks: Task[], key: SmartViewKey, reference = todayKey()): Task[] {
  const open = openVisibleTasks(tasks);
  const nextWeekAnchor = addDays(startOfWeek(reference), 7);
  const filtered = open.filter((task) => {
    if (key === 'today') return task.dueDate === reference || isOverdue(task, reference);
    if (key === 'planned') return Boolean(task.dueDate);
    if (key === 'this-week') return isInWeek(task.dueDate, reference);
    if (key === 'next-week') return isInWeek(task.dueDate, nextWeekAnchor);
    if (key === 'flagged') return task.isFlagged;
    if (key === 'urgent') return task.priority === 'high';
    return false;
  });
  return sortTasks(filtered);
}

export function getSmartViewCounts(tasks: Task[], reference = todayKey()): Record<SmartViewKey, number> {
  return {
    today: getSmartViewTasks(tasks, 'today', reference).length,
    planned: getSmartViewTasks(tasks, 'planned', reference).length,
    'this-week': getSmartViewTasks(tasks, 'this-week', reference).length,
    'next-week': getSmartViewTasks(tasks, 'next-week', reference).length,
    flagged: getSmartViewTasks(tasks, 'flagged', reference).length,
    urgent: getSmartViewTasks(tasks, 'urgent', reference).length
  };
}
