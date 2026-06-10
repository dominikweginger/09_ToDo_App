import { ArrowDown, ArrowUp, CalendarClock, FileText, Flag, Pencil, Repeat, Trash2 } from 'lucide-react';
import { formatDateLabel } from '../domain/date-utils';
import { TodoList } from '../domain/list-model';
import { priorityLabel, Task } from '../domain/task-model';
import { isOverdue } from '../domain/task-service';

interface Props {
  task: Task;
  list?: TodoList;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag?: (task: Task) => void;
  onMoveSort?: (task: Task, direction: -1 | 1) => void;
  onMoveDate?: (task: Task, dueDate: string | null) => void;
}

export function TaskCard({ task, list, onToggle, onEdit, onDelete, onToggleFlag, onMoveSort, onMoveDate }: Props) {
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
          {list && <strong>{list.name}</strong>}
          {overdue && <strong className="danger-text">Ueberfaellig</strong>}
        </div>
        <div className="task-badges">
          {task.isFlagged && (
            <span>
              <Flag size={13} aria-hidden="true" /> Markiert
            </span>
          )}
          {task.recurrence?.enabled && (
            <span>
              <Repeat size={13} aria-hidden="true" /> Wiederholung
            </span>
          )}
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
        {onMoveSort && (
          <>
            <button type="button" className="icon-button" onClick={() => onMoveSort(task, -1)} aria-label="Nach oben" title="Nach oben">
              <ArrowUp size={16} aria-hidden="true" />
            </button>
            <button type="button" className="icon-button" onClick={() => onMoveSort(task, 1)} aria-label="Nach unten" title="Nach unten">
              <ArrowDown size={16} aria-hidden="true" />
            </button>
          </>
        )}
        {onToggleFlag && (
          <button type="button" className={`icon-button ${task.isFlagged ? 'strong' : ''}`} onClick={() => onToggleFlag(task)} aria-label="Markierung wechseln" title="Markieren">
            <Flag size={17} aria-hidden="true" />
          </button>
        )}
        <button type="button" className="icon-button" onClick={() => onEdit(task)} aria-label="Aufgabe bearbeiten" title="Bearbeiten">
          <Pencil size={18} aria-hidden="true" />
        </button>
        <button type="button" className="icon-button danger" onClick={() => onDelete(task)} aria-label="Aufgabe loeschen" title="Loeschen">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
