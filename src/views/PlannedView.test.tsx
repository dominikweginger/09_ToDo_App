import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIST_ID } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { PlannedView } from './PlannedView';

const lists = [{ id: DEFAULT_LIST_ID, name: 'Allgemein', color: '#2563eb', sortOrder: 0, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }];

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Morgen Aufgabe',
    description: null,
    status: 'open',
    listId: DEFAULT_LIST_ID,
    dueDate: '2026-06-15',
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

afterEach(() => {
  vi.useRealTimers();
});

describe('PlannedView', () => {
  it('does not duplicate tomorrow tasks in next week on Sundays', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));

    render(
      <PlannedView
        tasks={[task()]}
        lists={lists}
        selectedDate="2026-06-15"
        onSelectedDate={vi.fn()}
        onAddForDate={vi.fn()}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleFlag={vi.fn()}
        onMoveDate={vi.fn()}
      />
    );

    const tomorrowSection = screen.getByRole('heading', { name: 'Morgen' }).closest('section');
    const nextWeekSection = screen.getByRole('heading', { name: 'Naechste Woche' }).closest('section');

    expect(tomorrowSection).not.toBeNull();
    expect(nextWeekSection).not.toBeNull();
    expect(within(tomorrowSection!).getByText('Morgen Aufgabe')).toBeInTheDocument();
    expect(within(nextWeekSection!).queryByText('Morgen Aufgabe')).not.toBeInTheDocument();
    expect(within(nextWeekSection!).getByText('Keine Aufgaben.')).toBeInTheDocument();
  });

  it('shows overdue tasks above today without duplicating them', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));

    render(
      <PlannedView
        tasks={[
          task({ id: 'overdue', title: 'Ueberfaellige Aufgabe', dueDate: '2026-06-13' }),
          task({ id: 'today', title: 'Heutige Aufgabe', dueDate: '2026-06-14' })
        ]}
        lists={lists}
        selectedDate="2026-06-14"
        onSelectedDate={vi.fn()}
        onAddForDate={vi.fn()}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleFlag={vi.fn()}
        onMoveDate={vi.fn()}
      />
    );

    const overdueSection = screen.getByRole('heading', { name: 'Ueberfaellig' }).closest('section');
    const todaySection = screen.getByRole('heading', { name: 'Heute' }).closest('section');

    expect(overdueSection).not.toBeNull();
    expect(todaySection).not.toBeNull();
    expect(within(overdueSection!).getByText('Ueberfaellige Aufgabe')).toBeInTheDocument();
    expect(within(todaySection!).queryByText('Ueberfaellige Aufgabe')).not.toBeInTheDocument();
    expect(within(todaySection!).getByText('Heutige Aufgabe')).toBeInTheDocument();
  });

  it('uses the selected date when the empty week-day action is clicked', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));
    const onAddForDate = vi.fn();

    render(
      <PlannedView
        tasks={[]}
        lists={lists}
        selectedDate="2026-06-16"
        onSelectedDate={vi.fn()}
        onAddForDate={onAddForDate}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleFlag={vi.fn()}
        onMoveDate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Woche' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aufgabe fuer diesen Tag erstellen' }));

    expect(onAddForDate).toHaveBeenCalledWith('2026-06-16');
  });
});
