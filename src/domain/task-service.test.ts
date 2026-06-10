import { describe, expect, it } from 'vitest';
import { DEFAULT_LIST_ID } from './list-model';
import { createTask, isOverdue, sortTasks, toggleTaskDone } from './task-service';
import { TaskDraft } from './task-model';

function draft(overrides: Partial<TaskDraft> = {}): TaskDraft {
  return {
    title: 'Aufgabe',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'none',
    listId: DEFAULT_LIST_ID,
    isFlagged: false,
    recurrence: null,
    status: 'open',
    ...overrides
  };
}

describe('task-service', () => {
  it('creates a valid local task in the default list', () => {
    const task = createTask(draft({ title: 'Rechnung pruefen', dueDate: '2026-06-09', dueTime: '09:30', priority: 'high' }));

    expect(task.id).toBeTruthy();
    expect(task.status).toBe('open');
    expect(task.listId).toBe(DEFAULT_LIST_ID);
    expect(task.isFlagged).toBe(false);
    expect(task.sortOrder).toBeGreaterThan(0);
    expect(task.dueDate).toBe('2026-06-09');
  });

  it('rejects a task without title', () => {
    expect(() => createTask(draft({ title: ' ' }))).toThrow('Titel');
  });

  it('toggles done and open states', () => {
    const task = createTask(draft({ title: 'Termin' }));

    const done = toggleTaskDone(task);
    expect(done.status).toBe('done');
    expect(done.completedAt).toBeTruthy();
    expect(toggleTaskDone(done).status).toBe('open');
  });

  it('moves recurring tasks to the next due date instead of completing them', () => {
    const task = createTask(draft({ title: 'Pflanzen giessen', dueDate: '2026-06-10', recurrence: { enabled: true, frequency: 'daily', interval: 1, endDate: null, advanceMode: 'scheduledDate' } }));

    const next = toggleTaskDone(task);
    expect(next.status).toBe('open');
    expect(next.dueDate).toBe('2026-06-11');
    expect(next.completedAt).toBeNull();
  });

  it('detects overdue open tasks', () => {
    const task = createTask(draft({ title: 'Alt', dueDate: '2026-06-08' }));

    expect(isOverdue(task, '2026-06-09')).toBe(true);
  });

  it('sorts tasks by date and time', () => {
    const late = createTask(draft({ title: 'B', dueDate: '2026-06-10' }));
    const early = createTask(draft({ title: 'A', dueDate: '2026-06-09', dueTime: '08:00' }));
    expect(sortTasks([late, early])[0].title).toBe('A');
  });
});
