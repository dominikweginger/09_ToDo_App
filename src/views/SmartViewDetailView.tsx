import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { todayKey } from '../domain/date-utils';
import { TodoList } from '../domain/list-model';
import { SmartViewKey, getSmartViewTasks, smartViewLabels } from '../domain/smart-view-service';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';

interface Props {
  smartView: SmartViewKey;
  tasks: Task[];
  lists: TodoList[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
  onCreate: (defaults?: { date?: string | null }) => void;
}

export function SmartViewDetailView({ smartView, tasks, lists, onCreate, ...actions }: Props) {
  const visibleTasks = getSmartViewTasks(tasks, smartView);
  const today = todayKey();

  if (smartView === 'today') {
    const openTasks = tasks.filter((task) => task.status === 'open');
    const overdueTasks = sortTasks(openTasks.filter((task) => task.dueDate && task.dueDate < today));
    const todayTasks = sortTasks(openTasks.filter((task) => task.dueDate === today));

    return (
      <section className="view">
        <header className="view-header">
          <h1>{smartViewLabels[smartView]}</h1>
          <p>Berechnete Ansicht offener Aufgaben.</p>
        </header>
        <TaskSection title="Ueberfaellig" tasks={overdueTasks} lists={lists} actions={actions} emptyText="Keine ueberfaelligen Aufgaben." />
        <TaskSection
          title="Heute"
          tasks={todayTasks}
          lists={lists}
          actions={actions}
          emptyText="Keine Aufgaben fuer heute."
          actionLabel="Aufgabe fuer heute erstellen"
          onAction={() => onCreate({ date: today })}
        />
        <section className="section-block">
          <div className="section-head">
            <h2>Spaeter / Ohne Datum</h2>
            <span>Hinweis</span>
          </div>
          <p className="muted-line">Aufgaben ohne Datum bleiben in der Smart View Ohne Datum, damit Heute fokussiert bleibt.</p>
          <button type="button" className="primary-button section-action" onClick={() => onCreate({ date: null })}>
            Aufgabe ohne Datum erstellen
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="view">
      <header className="view-header">
        <h1>{smartViewLabels[smartView]}</h1>
        <p>Berechnete Ansicht offener Aufgaben.</p>
      </header>
      {visibleTasks.length === 0 ? (
        <EmptyState
          title="Keine passenden Aufgaben"
          text="Diese Ansicht aktualisiert sich automatisch aus deinen Aufgaben."
          actionLabel={smartView === 'no-date' ? 'Aufgabe ohne Datum erstellen' : undefined}
          onAction={smartView === 'no-date' ? () => onCreate({ date: null }) : undefined}
        />
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

type TaskActions = Omit<Props, 'smartView' | 'tasks' | 'lists' | 'onCreate'>;

function TaskSection({
  title,
  tasks,
  lists,
  actions,
  emptyText,
  actionLabel,
  onAction
}: {
  title: string;
  tasks: Task[];
  lists: TodoList[];
  actions: TaskActions;
  emptyText: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <>
          <p className="muted-line">{emptyText}</p>
          {actionLabel && onAction && (
            <button type="button" className="primary-button section-action" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} list={lists.find((list) => list.id === task.listId)} {...actions} />
          ))}
        </div>
      )}
    </section>
  );
}
