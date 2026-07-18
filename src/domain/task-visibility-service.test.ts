import { describe, expect, it } from 'vitest';
import { TodoList, createDefaultList } from './list-model';
import { Task } from './task-model';
import { getTasksVisibleOutsideOwnList } from './task-visibility-service';

const lists: TodoList[] = [
  createDefaultList('2026-06-14T08:00:00.000Z'),
  { id: 'normal', name: 'Normal', color: null, isChecklist: false, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' },
  { id: 'check-a', name: 'Einkauf', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' },
  { id: 'check-b', name: 'Packen', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }
];

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task', title: 'Aufgabe', description: null, status: 'open', listId: 'normal', dueDate: null, dueTime: null,
    priority: 'none', isFlagged: false, recurrence: null, sortOrder: 1, createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z', completedAt: null, ...overrides
  };
}

describe('getTasksVisibleOutsideOwnList', () => {
  it('applies only the checklist-and-no-date matrix across statuses and features', () => {
    const cases = [
      task({ id: 'normal-undated' }),
      task({ id: 'normal-dated', dueDate: '2026-06-14' }),
      task({ id: 'check-undated', listId: 'check-a' }),
      task({ id: 'check-dated', listId: 'check-a', dueDate: '2026-06-14' }),
      task({ id: 'check-done', listId: 'check-a', status: 'done' }),
      task({ id: 'check-flagged', listId: 'check-a', isFlagged: true }),
      task({ id: 'check-urgent', listId: 'check-b', priority: 'high' }),
      task({ id: 'check-dated-flagged', listId: 'check-b', dueDate: '2026-06-15', isFlagged: true, priority: 'high' }),
      task({ id: 'unknown', listId: 'missing' })
    ];

    expect(getTasksVisibleOutsideOwnList(cases, lists).map((item) => item.id)).toEqual([
      'normal-undated', 'normal-dated', 'check-dated', 'check-dated-flagged', 'unknown'
    ]);
  });

  it('returns a new array without mutating inputs and supports empty arrays', () => {
    const tasks = [task()];
    const tasksBefore = structuredClone(tasks);
    const listsBefore = structuredClone(lists);
    const result = getTasksVisibleOutsideOwnList(tasks, lists);

    expect(result).not.toBe(tasks);
    expect(tasks).toEqual(tasksBefore);
    expect(lists).toEqual(listsBefore);
    expect(getTasksVisibleOutsideOwnList([], [])).toEqual([]);
  });
});
