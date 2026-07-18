import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { ListDetailView } from './ListDetailView';

const checklist: TodoList = { id: 'check', name: 'Einkauf', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' };

function task(overrides: Partial<Task>): Task {
  return {
    id: 'task', title: 'Aufgabe', description: null, status: 'open', listId: checklist.id, dueDate: null, dueTime: null,
    priority: 'none', isFlagged: false, recurrence: null, sortOrder: 1, createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z', completedAt: null, ...overrides
  };
}

describe('ListDetailView checklist regression', () => {
  it('keeps undated open, done, and flagged tasks visible in their own checklist filters', () => {
    render(
      <ListDetailView
        list={checklist}
        tasks={[
          task({ id: 'open', title: 'Offen' }),
          task({ id: 'done', title: 'Erledigt', status: 'done' }),
          task({ id: 'flagged', title: 'Markiert', isFlagged: true })
        ]}
        onAdd={vi.fn()}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleFlag={vi.fn()}
        onMoveSort={vi.fn()}
        onMoveDate={vi.fn()}
      />
    );

    expect(screen.getByText('Offen', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByText('Markiert', { selector: 'h3' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Erledigt' }));
    expect(screen.getByText('Erledigt', { selector: 'h3' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Markiert' }));
    expect(screen.getByText('Markiert', { selector: 'h3' })).toBeInTheDocument();
  });
});
