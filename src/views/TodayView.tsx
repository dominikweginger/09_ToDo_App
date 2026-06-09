import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { todayKey } from '../domain/date-utils';
import { Task } from '../domain/task-model';
import { isOverdue, sortTasks } from '../domain/task-service';

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function TodayView(props: Props) {
  const today = todayKey();
  const tasks = sortTasks(props.tasks.filter((task) => task.status === 'open' && (task.dueDate === today || isOverdue(task, today))));

  return (
    <section className="view">
      <header className="view-header">
        <h1>Heute</h1>
        <p>{new Intl.DateTimeFormat('de-AT', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date())}</p>
      </header>
      {tasks.length === 0 ? (
        <EmptyState title="Keine offenen Aufgaben für heute" text="Neue Aufgaben kannst du jederzeit über den Plus-Button erfassen." />
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
