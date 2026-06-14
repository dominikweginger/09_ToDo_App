import { describe, expect, it } from 'vitest';
import { DEFAULT_LIST_ID } from './list-model';
import { getSmartViewCounts, getSmartViewTasks } from './smart-view-service';
import { Task } from './task-model';

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    title: 'Aufgabe',
    description: null,
    status: 'open',
    listId: DEFAULT_LIST_ID,
    dueDate: null,
    dueTime: null,
    priority: 'none',
    isFlagged: false,
    recurrence: null,
    sortOrder: 1,
    createdAt: '2026-06-10T08:00:00.000Z',
    updatedAt: '2026-06-10T08:00:00.000Z',
    completedAt: null,
    ...overrides
  };
}

describe('smart-view-service', () => {
  it('returns only open tasks without due date for no-date', () => {
    const openWithoutDate = task({ id: 'open-without-date', dueDate: null });
    const openWithDate = task({ id: 'open-with-date', dueDate: '2026-06-14' });
    const doneWithoutDate = task({ id: 'done-without-date', status: 'done', dueDate: null });
    const archivedWithoutDate = task({ id: 'archived-without-date', status: 'archived', dueDate: null });

    expect(getSmartViewTasks([openWithoutDate, openWithDate, doneWithoutDate, archivedWithoutDate], 'no-date')).toEqual([openWithoutDate]);
  });

  it('counts open tasks without due date for no-date', () => {
    const counts = getSmartViewCounts([
      task({ id: 'open-without-date', dueDate: null }),
      task({ id: 'open-with-date', dueDate: '2026-06-14' }),
      task({ id: 'done-without-date', status: 'done', dueDate: null })
    ]);

    expect(counts['no-date']).toBe(1);
  });

  it('does not count done tasks without due date for no-date', () => {
    const counts = getSmartViewCounts([task({ id: 'done-without-date', status: 'done', dueDate: null })]);

    expect(counts['no-date']).toBe(0);
  });
});
