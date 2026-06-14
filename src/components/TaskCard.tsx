import { CalendarClock, Flag, MoreHorizontal, Repeat } from 'lucide-react';
import { useState } from 'react';
import { formatDateLabel } from '../domain/date-utils';
import { TodoList } from '../domain/list-model';
import { priorityLabel, Task } from '../domain/task-model';
import { isOverdue } from '../domain/task-service';
import { TaskActionSheet } from './TaskActionSheet';

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
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const overdue = isOverdue(task);

  return (
    <>
      <article className={`task-card ${task.status === 'done' ? 'task-card-done' : ''} ${overdue ? 'task-card-overdue' : ''}`}>
        <button className={`status-toggle ${task.status === 'done' ? 'status-toggle-done' : ''}`} type="button" onClick={() => onToggle(task)} aria-label="Status wechseln">
          <span aria-hidden="true" />
        </button>
        <div className="task-content">
          <h3>{task.title}</h3>
          <div className="task-meta">
            <span>
              <CalendarClock size={14} aria-hidden="true" />
              {formatDateLabel(task.dueDate)}
              {task.dueTime ? ` - ${task.dueTime}` : ''}
            </span>
            {list && <strong>{list.name}</strong>}
            {overdue && <strong className="danger-text">Ueberfaellig</strong>}
          </div>
          <div className="task-badges">
            {task.priority !== 'none' && <span>{priorityLabel[task.priority]}</span>}
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
        </div>
        <button type="button" className="more-button" onClick={() => setActionSheetOpen(true)} aria-label="Mehr Aktionen" title="Mehr">
          <MoreHorizontal size={18} aria-hidden="true" />
          <span>Mehr</span>
        </button>
      </article>
      {actionSheetOpen && (
        <TaskActionSheet
          task={task}
          onClose={() => setActionSheetOpen(false)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFlag={onToggleFlag}
          onMoveSort={onMoveSort}
          onMoveDate={onMoveDate}
        />
      )}
    </>
  );
}
