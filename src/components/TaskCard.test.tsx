import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { todayKey } from '../domain/date-utils';
import { DEFAULT_LIST_ID } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { addDays } from '../domain/week-utils';
import { TaskCard } from './TaskCard';

const list = { id: DEFAULT_LIST_ID, name: 'Allgemein', color: '#2563eb', isChecklist: false, sortOrder: 0, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' };

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Ruhige Karte pruefen',
    description: 'Interne Notiz',
    status: 'open',
    listId: DEFAULT_LIST_ID,
    dueDate: '2026-06-20',
    dueTime: '09:30',
    priority: 'high',
    isFlagged: true,
    recurrence: null,
    sortOrder: 1,
    createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z',
    completedAt: null,
    ...overrides
  };
}

function renderCard(overrides: Partial<React.ComponentProps<typeof TaskCard>> = {}) {
  const props = {
    task: task(),
    list,
    onToggle: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onToggleFlag: vi.fn(),
    onMoveDate: vi.fn(),
    ...overrides
  };

  render(<TaskCard {...props} />);
  return props;
}

describe('TaskCard', () => {
  it('keeps secondary actions out of the default card and exposes them via Mehr', () => {
    const props = renderCard();

    expect(screen.getByRole('button', { name: 'Status wechseln' })).toBeInTheDocument();
    expect(screen.getByText('Ruhige Karte pruefen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mehr Aktionen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Bearbeiten' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Loeschen' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Mehr Aktionen' }));
    const dialog = screen.getByRole('dialog', { name: 'Mehr' });

    fireEvent.click(within(dialog).getByRole('button', { name: 'Bearbeiten' }));
    expect(props.onEdit).toHaveBeenCalledWith(props.task);
  });

  it('moves a task to tomorrow and without a date from the action sheet', () => {
    const props = renderCard();

    fireEvent.click(screen.getByRole('button', { name: 'Mehr Aktionen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Morgen' }));
    expect(props.onMoveDate).toHaveBeenCalledWith(props.task, addDays(todayKey(), 1));

    fireEvent.click(screen.getByRole('button', { name: 'Mehr Aktionen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ohne Datum' }));
    expect(props.onMoveDate).toHaveBeenCalledWith(props.task, null);
  });

  it('shows date input only after choosing Datum waehlen', () => {
    const props = renderCard();

    fireEvent.click(screen.getByRole('button', { name: 'Mehr Aktionen' }));
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Datum waehlen' }));
    const dateInput = screen.getByLabelText('Datum');
    fireEvent.change(dateInput, { target: { value: '2026-07-01' } });

    expect(props.onMoveDate).toHaveBeenCalledWith(props.task, '2026-07-01');
  });
});
