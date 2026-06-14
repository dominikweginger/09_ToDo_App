import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIST_ID } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { SmartViewDetailView } from './SmartViewDetailView';

const lists = [{ id: DEFAULT_LIST_ID, name: 'Allgemein', color: '#2563eb', sortOrder: 0, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }];

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Aufgabe',
    description: null,
    status: 'open',
    listId: DEFAULT_LIST_ID,
    dueDate: '2026-06-14',
    dueTime: null,
    priority: 'none',
    isFlagged: false,
    recurrence: null,
    sortOrder: 1,
    createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z',
    completedAt: null,
    ...overrides
  };
}

const actions = {
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onToggleFlag: vi.fn(),
  onMoveDate: vi.fn()
};

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('SmartViewDetailView', () => {
  it('separates overdue and today tasks in the today smart view', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));

    render(
      <SmartViewDetailView
        smartView="today"
        tasks={[
          task({ id: 'overdue', title: 'Ueberfaellige Aufgabe', dueDate: '2026-06-13' }),
          task({ id: 'today', title: 'Heutige Aufgabe', dueDate: '2026-06-14' }),
          task({ id: 'no-date', title: 'Undatierte Aufgabe', dueDate: null })
        ]}
        lists={lists}
        onCreate={vi.fn()}
        {...actions}
      />
    );

    const overdueSection = screen.getByRole('heading', { name: 'Ueberfaellig' }).closest('section');
    const todaySection = screen.getByRole('heading', { name: 'Heute', level: 2 }).closest('section');
    const noDateSection = screen.getByRole('heading', { name: 'Spaeter / Ohne Datum' }).closest('section');

    expect(overdueSection).not.toBeNull();
    expect(todaySection).not.toBeNull();
    expect(noDateSection).not.toBeNull();
    expect(within(overdueSection!).getByText('Ueberfaellige Aufgabe')).toBeInTheDocument();
    expect(within(todaySection!).getByText('Heutige Aufgabe')).toBeInTheDocument();
    expect(within(noDateSection!).getByText('Aufgaben ohne Datum bleiben in der Smart View Ohne Datum, damit Heute fokussiert bleibt.')).toBeInTheDocument();
    expect(screen.queryByText('Undatierte Aufgabe')).not.toBeInTheDocument();
  });

  it('offers today defaults from the empty today smart view', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));
    const onCreate = vi.fn();

    render(<SmartViewDetailView smartView="today" tasks={[]} lists={lists} onCreate={onCreate} {...actions} />);

    expect(screen.getByRole('heading', { name: 'Ueberfaellig' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Heute', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Spaeter / Ohne Datum' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Aufgabe fuer heute erstellen' }));

    expect(onCreate).toHaveBeenCalledWith({ date: '2026-06-14' });
  });

  it('offers no-date defaults from an empty no-date smart view', () => {
    const onCreate = vi.fn();

    render(<SmartViewDetailView smartView="no-date" tasks={[]} lists={lists} onCreate={onCreate} {...actions} />);

    fireEvent.click(screen.getByRole('button', { name: 'Aufgabe ohne Datum erstellen' }));

    expect(onCreate).toHaveBeenCalledWith({ date: null });
  });
});
