import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDateLabel } from '../domain/date-utils';
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

function quickDateButtons(): HTMLButtonElement[] {
  return within(screen.getByLabelText('Schnelldatum')).getAllByRole('button');
}

function expectOnlyPressed(activeButton: HTMLElement): void {
  const buttons = quickDateButtons();
  expect(buttons).toHaveLength(5);

  buttons.forEach((button) => {
    expect(button).toHaveAttribute('aria-pressed', button === activeButton ? 'true' : 'false');
  });

  const checkIcons = buttons.flatMap((button) => Array.from(button.querySelectorAll('svg[aria-hidden="true"]')));
  expect(checkIcons).toHaveLength(1);
  expect(activeButton.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 29, 12));
});

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
  it('starts a new task without a date with only Ohne Datum pressed', () => {
    render(<TaskForm task={null} lists={lists} onSave={vi.fn()} onCancel={vi.fn()} />);

    const noneButton = screen.getByRole('button', { name: 'Ohne Datum' });
    expectOnlyPressed(noneButton);
    expect(quickDateButtons().map((button) => button.textContent)).toEqual([
      'Heute',
      'Morgen',
      'Naechste Woche',
      'Datum wählen',
      'Ohne Datum'
    ]);
    quickDateButtons().forEach((button) => expect(button).toHaveAttribute('aria-pressed'));
  });

  it('keeps quick capture compact and saves a task with only a title', () => {
    const onSave = vi.fn();
    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Titel')).toBeInTheDocument();
    expect(screen.getByLabelText('Liste')).toBeInTheDocument();
    expect(screen.queryByLabelText('Notiz')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Diese Woche' })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Milch kaufen' } });
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Milch kaufen', dueDate: '', priority: 'none', status: 'open' }));
  });

  it.each([
    ['Heute', '2026-07-29'],
    ['Morgen', '2026-07-30'],
    ['Naechste Woche', '2026-08-03']
  ])('activates only %s and saves its established date', (label, expectedDate) => {
    const onSave = vi.fn();
    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: `${label} planen` } });
    const button = screen.getByRole('button', { name: label });
    fireEvent.click(button);

    expectOnlyPressed(button);
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue(expectedDate);

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ dueDate: expectedDate }));
  });

  it('clears the due date and activates only Ohne Datum', () => {
    const onSave = vi.fn();
    render(<TaskForm task={null} lists={lists} defaultDate="2026-08-06" onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Datum entfernen' } });
    const noneButton = screen.getByRole('button', { name: 'Ohne Datum' });
    fireEvent.click(noneButton);

    expectOnlyPressed(noneButton);
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue('');

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '' }));
  });

  it('shows a custom date as the active picker button and opens the native picker again', () => {
    const showPicker = vi.fn();
    Object.defineProperty(HTMLInputElement.prototype, 'showPicker', {
      configurable: true,
      value: showPicker
    });
    const customDate = '2026-08-06';
    const formattedDate = formatDateLabel(customDate);

    render(<TaskForm task={null} lists={lists} defaultDate={customDate} onSave={vi.fn()} onCancel={vi.fn()} />);

    const customButton = screen.getByRole('button', {
      name: `Ausgewähltes Datum ${formattedDate}. Datum ändern`
    });
    expect(customButton).toHaveTextContent(formattedDate);
    expect(screen.queryByRole('button', { name: 'Datum wählen' })).not.toBeInTheDocument();
    expectOnlyPressed(customButton);

    fireEvent.click(customButton);
    expect(showPicker).toHaveBeenCalledTimes(1);
  });

  it('maps tomorrow selected through the free picker back to the Morgen preset', () => {
    render(<TaskForm task={null} lists={lists} defaultDate="2026-08-06" onSave={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Native Datumsauswahl'), { target: { value: '2026-07-30' } });

    const tomorrowButton = screen.getByRole('button', { name: 'Morgen' });
    expectOnlyPressed(tomorrowButton);
    expect(screen.getByRole('button', { name: 'Datum wählen' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses the native picker value as the single source and saves the latest choice', () => {
    const onSave = vi.fn();
    const customDate = '2026-08-06';
    render(<TaskForm task={null} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Titel'), { target: { value: 'Reise planen' } });
    fireEvent.change(screen.getByLabelText('Native Datumsauswahl'), { target: { value: customDate } });

    const customButton = screen.getByRole('button', {
      name: `Ausgewähltes Datum ${formatDateLabel(customDate)}. Datum ändern`
    });
    expectOnlyPressed(customButton);
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue(customDate);

    fireEvent.change(screen.getByLabelText('Native Datumsauswahl'), { target: { value: '2026-07-29' } });
    const todayButton = screen.getByRole('button', { name: 'Heute' });
    expectOnlyPressed(todayButton);
    expect(screen.getByRole('button', { name: 'Datum wählen' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Details anzeigen' }));
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '2026-07-29' }));
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

  it('initializes existing and new tasks with the correct active date option', () => {
    const cases = [
      {
        props: { task: task({ dueDate: '2026-08-06' }), defaultDate: undefined },
        name: `Ausgewähltes Datum ${formatDateLabel('2026-08-06')}. Datum ändern`
      },
      { props: { task: task({ dueDate: null }), defaultDate: undefined }, name: 'Ohne Datum' },
      { props: { task: null, defaultDate: '2026-07-30' }, name: 'Morgen' },
      {
        props: { task: null, defaultDate: '2026-08-06' },
        name: `Ausgewähltes Datum ${formatDateLabel('2026-08-06')}. Datum ändern`
      }
    ];

    cases.forEach(({ props, name }) => {
      const { unmount } = render(
        <TaskForm
          task={props.task}
          lists={lists}
          defaultDate={props.defaultDate}
          onSave={vi.fn()}
          onCancel={vi.fn()}
        />
      );
      expectOnlyPressed(screen.getByRole('button', { name }));
      unmount();
    });
  });

  it('opens and closes details and saves priority from segmented controls', () => {
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

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }));
  });

  it('opens details for optional data and preserves all unchanged values', () => {
    const onSave = vi.fn();
    const existing = task({
      description: 'Rueckfrage offen',
      dueDate: '2026-08-06',
      dueTime: '09:30',
      priority: 'medium',
      isFlagged: true,
      recurrence: { enabled: true, frequency: 'weekly', interval: 2, endDate: null, advanceMode: 'scheduledDate' }
    });

    render(<TaskForm task={existing} lists={lists} onSave={onSave} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Details ausblenden' })).toBeInTheDocument();
    expect(screen.getByLabelText('Notiz')).toHaveValue('Rueckfrage offen');
    expect(screen.queryByLabelText('Datum')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Native Datumsauswahl')).toHaveValue('2026-08-06');
    expect(screen.getByLabelText('Uhrzeit')).toHaveValue('09:30');
    expect(screen.getByLabelText('Markiert')).toBeChecked();
    expect(screen.getByLabelText('Wiederholung')).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Rueckfrage offen',
        dueDate: '2026-08-06',
        dueTime: '09:30',
        priority: 'medium',
        isFlagged: true,
        recurrence: expect.objectContaining({ enabled: true, frequency: 'weekly', interval: 2 })
      })
    );
  });
});
