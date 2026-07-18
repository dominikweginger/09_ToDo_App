import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoList, createDefaultList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { DashboardView } from './DashboardView';

const lists: TodoList[] = [
  createDefaultList('2026-06-14T08:00:00.000Z'),
  { id: 'normal', name: 'Normal', color: null, isChecklist: false, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' },
  { id: 'check-a', name: 'Einkauf', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' },
  { id: 'check-b', name: 'Packen', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }
];

function task(overrides: Partial<Task>): Task {
  return {
    id: 'task', title: 'Aufgabe', description: null, status: 'open', listId: 'normal', dueDate: null, dueTime: null,
    priority: 'none', isFlagged: false, recurrence: null, sortOrder: 1, createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z', completedAt: null, ...overrides
  };
}

describe('DashboardView checklist visibility', () => {
  it('filters smart counts but keeps complete per-list open counts for multiple checklists', () => {
    render(
      <DashboardView
        lists={lists}
        tasks={[
          task({ id: 'check-1', listId: 'check-a', isFlagged: true, priority: 'high' }),
          task({ id: 'check-2', listId: 'check-a', isFlagged: true, priority: 'high' }),
          task({ id: 'check-dated', listId: 'check-a', dueDate: '2026-12-20', isFlagged: true, priority: 'high' }),
          task({ id: 'second-check', listId: 'check-b', isFlagged: true, priority: 'high' }),
          task({ id: 'normal', listId: 'normal', isFlagged: true, priority: 'high' })
        ]}
        onOpenSmartView={vi.fn()}
        onOpenList={vi.fn()}
      />
    );

    expect(within(screen.getByRole('button', { name: /Ohne Datum/ })).getByText('1')).toBeInTheDocument();
    expect(within(screen.getByRole('button', { name: /Markiert/ })).getByText('2')).toBeInTheDocument();
    expect(within(screen.getByRole('button', { name: /Dringend/ })).getByText('2')).toBeInTheDocument();
    expect(within(screen.getByRole('button', { name: /Einkauf/ })).getByText('3')).toBeInTheDocument();
    expect(within(screen.getByRole('button', { name: /Packen/ })).getByText('1')).toBeInTheDocument();
  });
});
