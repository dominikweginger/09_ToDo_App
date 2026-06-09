import { X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { priorityLabel, Task, TaskDraft } from '../domain/task-model';
import { validateTaskDraft } from '../domain/task-validation';

interface Props {
  task: Task | null;
  defaultDate?: string | null;
  onSave: (draft: TaskDraft) => Promise<void> | void;
  onCancel: () => void;
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  priority: 'none',
  status: 'open'
};

export function TaskForm({ task, defaultDate, onSave, onCancel }: Props) {
  const initialDraft = useMemo<TaskDraft>(
    () =>
      task
        ? {
            title: task.title,
            description: task.description ?? '',
            dueDate: task.dueDate ?? '',
            dueTime: task.dueTime ?? '',
            priority: task.priority,
            status: task.status
          }
        : { ...emptyDraft, dueDate: defaultDate ?? '' },
    [task, defaultDate]
  );
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<string[]>([]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateTaskDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    await onSave(draft);
  }

  return (
    <div className="sheet-backdrop" role="presentation">
      <form className="task-form" onSubmit={submit} aria-label={task ? 'Aufgabe bearbeiten' : 'Aufgabe erstellen'}>
        <div className="sheet-head">
          <h2>{task ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h2>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Schliessen" title="Schließen">
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
        <label>
          Notiz
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} />
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
        <div className="form-grid">
          <label>
            Priorität
            <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as TaskDraft['priority'] })}>
              {Object.entries(priorityLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as TaskDraft['status'] })}>
              <option value="open">Offen</option>
              <option value="done">Erledigt</option>
            </select>
          </label>
        </div>
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
