import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function InboxView(props: Props) {
  const tasks = sortTasks(props.tasks.filter((task) => task.status === 'open' && !task.dueDate));
  return (
    <section className="view">
      <header className="view-header">
        <h1>Inbox</h1>
        <p>Aufgaben ohne Datum sammeln und später einplanen.</p>
      </header>
      {tasks.length === 0 ? (
        <EmptyState title="Inbox ist leer" text="Aufgaben ohne Datum landen automatisch hier." />
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} {...props} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
