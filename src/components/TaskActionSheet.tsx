import { ArrowDown, ArrowUp, CalendarClock, Flag, Pencil, Trash2, X } from 'lucide-react';
import { Task } from '../domain/task-model';
import { MoveDateChips } from './MoveDateChips';

interface Props {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag?: (task: Task) => void;
  onMoveSort?: (task: Task, direction: -1 | 1) => void;
  onMoveDate?: (task: Task, dueDate: string | null) => void;
}

export function TaskActionSheet({ task, onClose, onEdit, onDelete, onToggleFlag, onMoveSort, onMoveDate }: Props) {
  function runAction(action: () => void) {
    action();
    onClose();
  }

  return (
    <div className="action-sheet-backdrop" onClick={onClose}>
      <section className="action-sheet" role="dialog" aria-modal="true" aria-labelledby={`task-actions-${task.id}`} onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <h2 id={`task-actions-${task.id}`}>Mehr</h2>
            <p>{task.title}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Schliessen" title="Schliessen">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="action-list">
          <button type="button" onClick={() => runAction(() => onEdit(task))}>
            <Pencil size={18} aria-hidden="true" />
            Bearbeiten
          </button>
          {onToggleFlag && (
            <button type="button" onClick={() => runAction(() => onToggleFlag(task))}>
              <Flag size={18} aria-hidden="true" />
              {task.isFlagged ? 'Markierung entfernen' : 'Markieren'}
            </button>
          )}
        </div>

        {onMoveDate && (
          <div className="action-section">
            <h3>
              <CalendarClock size={16} aria-hidden="true" />
              Datum aendern
            </h3>
            <MoveDateChips
              currentDate={task.dueDate}
              onMoveDate={(dueDate) => {
                onMoveDate(task, dueDate);
                onClose();
              }}
            />
          </div>
        )}

        {onMoveSort && (
          <div className="action-section">
            <h3>Sortierung</h3>
            <div className="sort-actions">
              <button type="button" onClick={() => runAction(() => onMoveSort(task, -1))}>
                <ArrowUp size={17} aria-hidden="true" />
                Nach oben
              </button>
              <button type="button" onClick={() => runAction(() => onMoveSort(task, 1))}>
                <ArrowDown size={17} aria-hidden="true" />
                Nach unten
              </button>
            </div>
          </div>
        )}

        <div className="action-list">
          <button type="button" className="danger-action" onClick={() => runAction(() => onDelete(task))}>
            <Trash2 size={18} aria-hidden="true" />
            Loeschen
          </button>
        </div>

        <button type="button" className="secondary-button sheet-cancel" onClick={onClose}>
          Abbrechen
        </button>
      </section>
    </div>
  );
}
