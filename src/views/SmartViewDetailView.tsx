import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { TodoList } from '../domain/list-model';
import { SmartViewKey, getSmartViewTasks, smartViewLabels } from '../domain/smart-view-service';
import { Task } from '../domain/task-model';

interface Props {
  smartView: SmartViewKey;
  tasks: Task[];
  lists: TodoList[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function SmartViewDetailView({ smartView, tasks, lists, ...actions }: Props) {
  const visibleTasks = getSmartViewTasks(tasks, smartView);
  return (
    <section className="view">
      <header className="view-header">
        <h1>{smartViewLabels[smartView]}</h1>
        <p>Berechnete Ansicht offener Aufgaben.</p>
      </header>
      {visibleTasks.length === 0 ? (
        <EmptyState title="Keine passenden Aufgaben" text="Diese Ansicht aktualisiert sich automatisch aus deinen Aufgaben." />
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} list={lists.find((list) => list.id === task.listId)} {...actions} />
          ))}
        </div>
      )}
    </section>
  );
}
