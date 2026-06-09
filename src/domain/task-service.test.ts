import { describe, expect, it } from 'vitest';
import { createTask, isOverdue, sortTasks, toggleTaskDone } from './task-service';

describe('task-service', () => {
  it('creates a valid local task', () => {
    const task = createTask({
      title: 'Rechnung pruefen',
      description: '',
      dueDate: '2026-06-09',
      dueTime: '09:30',
      priority: 'high',
      status: 'open'
    });

    expect(task.id).toBeTruthy();
    expect(task.status).toBe('open');
    expect(task.dueDate).toBe('2026-06-09');
  });

  it('rejects a task without title', () => {
    expect(() =>
      createTask({
        title: ' ',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'none',
        status: 'open'
      })
    ).toThrow('Titel');
  });

  it('toggles done and open states', () => {
    const task = createTask({
      title: 'Termin',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'none',
      status: 'open'
    });

    const done = toggleTaskDone(task);
    expect(done.status).toBe('done');
    expect(done.completedAt).toBeTruthy();
    expect(toggleTaskDone(done).status).toBe('open');
  });

  it('detects overdue open tasks', () => {
    const task = createTask({
      title: 'Alt',
      description: '',
      dueDate: '2026-06-08',
      dueTime: '',
      priority: 'none',
      status: 'open'
    });

    expect(isOverdue(task, '2026-06-09')).toBe(true);
  });

  it('sorts tasks by date and time', () => {
    const late = createTask({ title: 'B', description: '', dueDate: '2026-06-10', dueTime: '', priority: 'none', status: 'open' });
    const early = createTask({ title: 'A', description: '', dueDate: '2026-06-09', dueTime: '08:00', priority: 'none', status: 'open' });
    expect(sortTasks([late, early])[0].title).toBe('A');
  });
});
