import { X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { todayKey } from '../domain/date-utils';
import { DEFAULT_LIST_ID, TodoList } from '../domain/list-model';
import { priorityLabel, Task, TaskDraft } from '../domain/task-model';
import { validateTaskDraft } from '../domain/task-validation';
import { addDays, startOfWeek } from '../domain/week-utils';
import { SegmentedControl } from './SegmentedControl';

interface Props {
  task: Task | null;
  lists: TodoList[];
  defaultDate?: string | null;
  defaultListId?: string | null;
  defaultFlagged?: boolean;
  defaultPriority?: TaskDraft['priority'];
  onSave: (draft: TaskDraft) => Promise<void> | void;
  onCancel: () => void;
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  priority: 'none',
  listId: DEFAULT_LIST_ID,
  isFlagged: false,
  recurrence: null,
  status: 'open'
};

const priorityOptions = Object.entries(priorityLabel).map(([key, label]) => ({
  key: key as TaskDraft['priority'],
  label
}));

function hasOpenDetails(task: Task | null) {
  if (!task) return false;

  return Boolean(
    task.description?.trim() ||
      task.dueTime ||
      task.priority !== 'none' ||
      task.status !== 'open' ||
      task.isFlagged ||
      task.recurrence?.enabled
  );
}

export function TaskForm({ task, lists, defaultDate, defaultListId, defaultFlagged, defaultPriority, onSave, onCancel }: Props) {
  const initialDraft = useMemo<TaskDraft>(
    () =>
      task
        ? {
            title: task.title,
            description: task.description ?? '',
            dueDate: task.dueDate ?? '',
            dueTime: task.dueTime ?? '',
            priority: task.priority,
            listId: task.listId,
            isFlagged: task.isFlagged,
            recurrence: task.recurrence,
            status: task.status
          }
        : {
            ...emptyDraft,
            dueDate: defaultDate ?? '',
            listId: defaultListId || DEFAULT_LIST_ID,
            isFlagged: defaultFlagged ?? false,
            priority: defaultPriority ?? 'none'
          },
    [task, defaultDate, defaultListId, defaultFlagged, defaultPriority]
  );
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(() => hasOpenDetails(task));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateTaskDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    await onSave(draft);
  }

  function setQuickDate(value: 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'none') {
    const today = todayKey();
    const nextWeek = addDays(startOfWeek(today), 7);
    const dueDate = value === 'today' ? today : value === 'tomorrow' ? addDays(today, 1) : value === 'this-week' ? today : value === 'next-week' ? nextWeek : '';
    setDraft({ ...draft, dueDate });
  }

  const recurrenceEnabled = Boolean(draft.recurrence?.enabled);

  return (
    <div className="sheet-backdrop" role="presentation">
      <form className="task-form" onSubmit={submit} aria-label={task ? 'Aufgabe bearbeiten' : 'Aufgabe erstellen'}>
        <div className="sheet-head">
          <h2>{task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h2>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Schliessen" title="Schliessen">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="error-box" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        <label>
          Titel
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} autoFocus />
        </label>
        <div className="quick-actions" aria-label="Schnelldatum">
          <button type="button" onClick={() => setQuickDate('today')}>Heute</button>
          <button type="button" onClick={() => setQuickDate('tomorrow')}>Morgen</button>
          <button type="button" onClick={() => setQuickDate('this-week')}>Diese Woche</button>
          <button type="button" onClick={() => setQuickDate('next-week')}>Naechste Woche</button>
          <button type="button" onClick={() => setQuickDate('none')}>Ohne Datum</button>
        </div>
        <label>
          Liste
          <select value={draft.listId} onChange={(event) => setDraft({ ...draft, listId: event.target.value })}>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="details-toggle" onClick={() => setDetailsOpen((open) => !open)} aria-expanded={detailsOpen}>
          {detailsOpen ? 'Details ausblenden' : 'Details anzeigen'}
        </button>

        {detailsOpen && (
          <div className="task-details">
            <label>
              Notiz
              <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={3} />
            </label>
            <div className="form-grid">
              <label>
                Datum
                <input type="date" value={draft.dueDate} onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })} />
              </label>
              <label>
                Uhrzeit
                <input type="time" value={draft.dueTime} onChange={(event) => setDraft({ ...draft, dueTime: event.target.value })} />
              </label>
            </div>
            <label>
              Prioritaet
              <SegmentedControl
                value={draft.priority}
                options={priorityOptions}
                onChange={(priority) => setDraft({ ...draft, priority })}
                ariaLabel="Prioritaet"
                className="priority-segments"
              />
            </label>
            <label>
              Status
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as TaskDraft['status'] })}>
                <option value="open">Offen</option>
                <option value="done">Erledigt</option>
              </select>
            </label>
            <label className="check-row">
              <input type="checkbox" checked={draft.isFlagged} onChange={(event) => setDraft({ ...draft, isFlagged: event.target.checked })} />
              Markiert
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={recurrenceEnabled}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    recurrence: event.target.checked ? { enabled: true, frequency: 'daily', interval: 1, endDate: null, advanceMode: 'scheduledDate' } : null
                  })
                }
              />
              Wiederholung
            </label>
            {recurrenceEnabled && (
              <div className="form-grid">
                <label>
                  Rhythmus
                  <select
                    value={draft.recurrence?.frequency ?? 'daily'}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        recurrence: {
                          ...(draft.recurrence ?? { enabled: true, interval: 1, advanceMode: 'scheduledDate' }),
                          frequency: event.target.value as NonNullable<TaskDraft['recurrence']>['frequency']
                        }
                      })
                    }
                  >
                    <option value="daily">Taeglich</option>
                    <option value="weekly">Woechentlich</option>
                    <option value="monthly">Monatlich</option>
                    <option value="yearly">Jaehrlich</option>
                  </select>
                </label>
                <label>
                  Intervall
                  <input
                    type="number"
                    min="1"
                    value={draft.recurrence?.interval ?? 1}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        recurrence: {
                          ...(draft.recurrence ?? { enabled: true, frequency: 'daily', advanceMode: 'scheduledDate' }),
                          interval: Number(event.target.value) || 1
                        }
                      })
                    }
                  />
                </label>
              </div>
            )}
          </div>
        )}
        <div className="sheet-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Abbrechen
          </button>
          <button type="submit" className="primary-button">
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
