import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIST_ID } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { TaskForm } from './TaskForm';

const lists = [{ id: DEFAULT_LIST_ID, name: 'Allgemein', color: '#2563eb', sortOrder: 0, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }];

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Bestehende Aufgabe',
    description: null,
    status: 'open',
    listId: DEFAULT_LIST_ID,
    dueDate: null,
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

describe('TaskForm', () => {
  it('starts new tasks in compact quick-capture mode and saves with only a title', async () => {
    const onSave = vi.fn();

    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Titel')).toBeInTheDocument();
    expect(screen.getByLabelText('Schnelldatum')).toBeInTheDocument();
    expect(screen.getByLabelText('Liste')).toBeInTheDocument();
    expect(screen.queryByLabelText('Notiz')).not.toBeInTheDocument();
    expect(screen.queryByText('Prioritaet')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Milch kaufen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Milch kaufen', description: '', priority: 'none', status: 'open' }));
  });

  it('opens and closes details and saves priority from segmented controls', async () => {
    const onSave = vi.fn();

    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Details anzeigen' }));
    expect(screen.getByLabelText('Notiz')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hoch' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hoch' }));
    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Steuer pruefen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Details ausblenden' }));
    expect(screen.queryByLabelText('Notiz')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }));
  });

  it('opens details when editing optional data and preserves unchanged values', async () => {
    const onSave = vi.fn();
    const existing = task({
      description: 'Rueckfrage offen',
      dueDate: '2026-06-20',
      dueTime: '09:30',
      priority: 'medium',
      isFlagged: true,
      recurrence: { enabled: true, frequency: 'weekly', interval: 2, endDate: null, advanceMode: 'scheduledDate' }
    });

    render(<TaskForm task={existing} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Details ausblenden' })).toBeInTheDocument();
    expect(screen.getByLabelText('Notiz')).toHaveValue('Rueckfrage offen');
    expect(screen.getByLabelText('Uhrzeit')).toHaveValue('09:30');
    expect(screen.getByLabelText('Markiert')).toBeChecked();
    expect(screen.getByLabelText('Wiederholung')).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Rueckfrage offen',
        dueDate: '2026-06-20',
        dueTime: '09:30',
        priority: 'medium',
        isFlagged: true,
        recurrence: expect.objectContaining({ enabled: true, frequency: 'weekly', interval: 2 })
      })
    );
  });
});
