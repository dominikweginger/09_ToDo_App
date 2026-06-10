import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { SegmentedControl } from '../components/SegmentedControl';
import { TaskCard } from '../components/TaskCard';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { sortListTasks } from '../domain/task-service';

type Filter = 'open' | 'done' | 'flagged';

interface Props {
  list: TodoList;
  tasks: Task[];
  onAdd: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag: (task: Task) => void;
  onMoveSort: (task: Task, direction: -1 | 1) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function ListDetailView({ list, tasks, onAdd, ...actions }: Props) {
  const [filter, setFilter] = useState<Filter>('open');
  const visibleTasks = sortListTasks(
    tasks.filter((task) => task.listId === list.id && (filter === 'open' ? task.status === 'open' : filter === 'done' ? task.status === 'done' : task.status === 'open' && task.isFlagged))
  );

  return (
    <section className="view">
      <header className="view-header row-header">
        <div>
          <h1>{list.name}</h1>
          <p>{visibleTasks.length} Aufgaben in dieser Ansicht.</p>
        </div>
        <button type="button" className="secondary-button compact" onClick={onAdd}>
          Aufgabe
        </button>
      </header>
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { key: 'open', label: 'Offen' },
          { key: 'done', label: 'Erledigt' },
          { key: 'flagged', label: 'Markiert' }
        ]}
      />
      {visibleTasks.length === 0 ? (
        <EmptyState title="Keine Aufgaben" text="Lege eine Aufgabe direkt in dieser Liste an." />
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} list={list} {...actions} />
          ))}
        </div>
      )}
    </section>
  );
}
