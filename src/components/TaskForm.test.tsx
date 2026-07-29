import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIST_ID } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { TaskForm } from './TaskForm';

const lists = [{ id: DEFAULT_LIST_ID, name: 'Allgemein', color: '#2563eb', isChecklist: false, sortOrder: 0, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }];
const originalShowPickerDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'showPicker');

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

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  if (originalShowPickerDescriptor) {
    Object.defineProperty(HTMLInputElement.prototype, 'showPicker', originalShowPickerDescriptor);
  } else {
    Reflect.deleteProperty(HTMLInputElement.prototype, 'showPicker');
  }
});

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

  it('shows the remaining quick dates and Datum wählen while details are closed', () => {
    render(<TaskForm task={null} lists={lists} onSave={vi.fn()} onCancel={vi.fn()} />);

    const quickDates = screen.getByLabelText('Schnelldatum');
    expect(screen.queryByRole('button', { name: 'Diese Woche' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
    expect(quickDates).toHaveTextContent('Heute');
    expect(quickDates).toHaveTextContent('Morgen');
    expect(quickDates).toHaveTextContent('Naechste Woche');
    expect(quickDates).toHaveTextContent('Datum wählen');
    expect(quickDates).toHaveTextContent('Ohne Datum');
    expect(within(quickDates).getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Heute',
      'Morgen',
      'Naechste Woche',
      'Datum wählen',
      'Ohne Datum'
    ]);
  });

  it('opens the native date picker with showPicker and keeps existing form values when no date is selected', () => {
    const showPicker = vi.fn();
    Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
      configurable: true,
      value: showPicker
    });

    render(<TaskForm task={null} lists={lists} defaultDate="2026-07-10" onSave={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Unveraendert' } });
    fireEvent.click(screen.getByRole('button', { name: 'Datum wählen' }));

    expect(showPicker).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Titel')).toHaveValue('Unveraendert');
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue('2026-07-10');
    fireEvent.click(screen.getByRole('button', { name: 'Details anzeigen' }));
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
  });

  it.each(['missing', 'throwing'] as const)('falls back safely when showPicker is %s', (support) => {
    if (support === 'throwing') {
      Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
        configurable: true,
        value: vi.fn(() => {
          throw new Error('Picker unavailable');
        })
      });
    }

    render(<TaskForm task={null} lists={lists} onSave={vi.fn()} onCancel={vi.fn()} />);
    const pickerInput = screen.getByLabelText('Native Datumsauswahl');
    const focus = vi.spyOn(pickerInput, 'focus');
    const click = vi.spyOn(pickerInput, 'click');

    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Datum wählen' }))).not.toThrow();
    expect(focus).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('saves a date selected through the native picker in YYYY-MM-DD format', async () => {
    const onSave = vi.fn();
    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Termin vorbereiten' } });
    fireEvent.change(screen.getByLabelText('Native Datumsauswahl'), { target: { value: '2026-09-14' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '2026-09-14' }));
  });

  it('keeps picker date and other form values while opening details and saving', async () => {
    const onSave = vi.fn();
    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Reise planen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Details anzeigen' }));
    fireEvent.change(screen.getByLabelText('Notiz'), { target: { value: 'Zug pruefen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Details ausblenden' }));

    fireEvent.change(screen.getByLabelText('Native Datumsauswahl'), { target: { value: '2026-08-03' } });
    fireEvent.click(screen.getByRole('button', { name: 'Details anzeigen' }));
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue('2026-08-03');
    expect(screen.getByLabelText('Notiz')).toHaveValue('Zug pruefen');

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Reise planen',
        description: 'Zug pruefen',
        dueDate: '2026-08-03'
      })
    );
  });

  it('keeps the established values of all remaining quick-date actions', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 17, 12));

    render(<TaskForm task={null} lists={lists} defaultDate="2026-06-30" onSave={vi.fn()} onCancel={vi.fn()} />);
    const dateInput = screen.getByLabelText('Native Datumsauswahl');

    fireEvent.click(screen.getByRole('button', { name: 'Heute' }));
    expect(dateInput).toHaveValue('2026-06-17');
    fireEvent.click(screen.getByRole('button', { name: 'Morgen' }));
    expect(dateInput).toHaveValue('2026-06-18');
    fireEvent.click(screen.getByRole('button', { name: 'Naechste Woche' }));
    expect(dateInput).toHaveValue('2026-06-22');
    fireEvent.click(screen.getByRole('button', { name: 'Ohne Datum' }));
    expect(dateInput).toHaveValue('');
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
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue('2026-06-20');
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
