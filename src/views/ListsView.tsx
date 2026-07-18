import { Plus } from 'lucide-react';
import { ListRow } from '../components/ListRow';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';

interface Props {
  tasks: Task[];
  lists: TodoList[];
  onCreateList: () => void;
  onEditList: (list: TodoList) => void;
  onDeleteList: (list: TodoList) => void;
  onOpenList: (listId: string) => void;
}

export function ListsView({ tasks, lists, onCreateList, onEditList, onDeleteList, onOpenList }: Props) {
  return (
    <section className="view">
      <header className="view-header row-header">
        <div>
          <h1>Listen</h1>
          <p>Aufgaben nach echten Listen ordnen.</p>
        </div>
        <button type="button" className="icon-button strong" onClick={onCreateList} aria-label="Liste erstellen" title="Liste erstellen">
          <Plus size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="list-stack">
        {lists.map((list) => (
          <ListRow
            key={list.id}
            list={list}
            count={tasks.filter((task) => task.listId === list.id && task.status === 'open').length}
            onOpen={() => onOpenList(list.id)}
            onEdit={() => onEditList(list)}
            onDelete={() => onDeleteList(list)}
          />
        ))}
      </div>
    </section>
  );
}
