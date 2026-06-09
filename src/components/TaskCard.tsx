import { CalendarClock, FileText, Pencil, Trash2 } from 'lucide-react';
import { formatDateLabel } from '../domain/date-utils';
import { priorityLabel, Task } from '../domain/task-model';
import { isOverdue } from '../domain/task-service';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveDate?: (task: Task, dueDate: string | null) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, onMoveDate }: Props) {
  const overdue = isOverdue(task);
  return (
    <article className={`task-card ${task.status === 'done' ? 'task-card-done' : ''} ${overdue ? 'task-card-overdue' : ''}`}>
      <button className="status-toggle" type="button" onClick={() => onToggle(task)} aria-label="Status wechseln">
        <span aria-hidden="true">{task.status === 'done' ? '✓' : ''}</span>
      </button>
      <div className="task-content">
        <h3>{task.title}</h3>
        <div className="task-meta">
          <span>
            <CalendarClock size={14} aria-hidden="true" />
            {formatDateLabel(task.dueDate)}
            {task.dueTime ? ` · ${task.dueTime}` : ''}
          </span>
          {task.priority !== 'none' && <strong>{priorityLabel[task.priority]}</strong>}
          {overdue && <strong className="danger-text">Überfällig</strong>}
        </div>
        {task.description && (
          <p className="note-marker">
            <FileText size={14} aria-hidden="true" />
            Notiz vorhanden
          </p>
        )}
        {onMoveDate && (
          <label className="inline-date">
            Verschieben
            <input type="date" value={task.dueDate ?? ''} onChange={(event) => onMoveDate(task, event.target.value || null)} />
          </label>
        )}
      </div>
      <div className="card-actions">
        <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label="Aufgabe bearbeiten" title="Bearbeiten">
          <Pencil size={18} aria-hidden="true" />
        </button>
        <button type="button" className="icon-button danger" onClick={() => onDelete(task)} aria-label="Aufgabe loeschen" title="Löschen">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
