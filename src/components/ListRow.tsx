import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { DEFAULT_LIST_ID, TodoList } from '../domain/list-model';

interface Props {
  list: TodoList;
  count: number;
  onOpen: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ListRow({ list, count, onOpen, onEdit, onDelete }: Props) {
  const isDefault = list.id === DEFAULT_LIST_ID;
  return (
    <article className="list-row">
      <button type="button" className="list-main" onClick={onOpen}>
        <span className="list-dot" style={{ background: list.color ?? '#64748b' }} />
        <span>{list.name}</span>
        <strong>{count}</strong>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <div className="list-actions">
        {!isDefault && onEdit && (
          <button type="button" className="icon-button" onClick={onEdit} aria-label="Liste bearbeiten" title="Bearbeiten">
            <Pencil size={16} aria-hidden="true" />
          </button>
        )}
        {!isDefault && onDelete && (
          <button type="button" className="icon-button danger" onClick={onDelete} aria-label="Liste loeschen" title="Loeschen">
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
