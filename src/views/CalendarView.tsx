import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { formatDateLabel, monthDays, todayKey, toDateKey } from '../domain/date-utils';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';

interface Props {
  tasks: Task[];
  lists: TodoList[];
  selectedDate: string;
  onSelectedDate: (date: string) => void;
  onAddForDate: (date: string) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function CalendarView({ tasks, lists, selectedDate, onSelectedDate, onAddForDate, ...taskActions }: Props) {
  const days = monthDays(selectedDate);
  const [year, month] = selectedDate.split('-').map(Number);
  const monthLabel = new Intl.DateTimeFormat('de-AT', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1));
  const selectedTasks = sortTasks(tasks.filter((task) => task.dueDate === selectedDate && task.status !== 'archived'));

  function changeMonth(offset: number) {
    const next = new Date(year, month - 1 + offset, 1);
    onSelectedDate(toDateKey(next));
  }

  return (
    <section className="calendar-panel">
      <header className="view-header row-header">
        <div>
          <h1>Kalender</h1>
          <p>{monthLabel}</p>
        </div>
        <div className="month-actions">
          <button className="icon-button" type="button" onClick={() => changeMonth(-1)} aria-label="Vorheriger Monat" title="Vorheriger Monat">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={() => changeMonth(1)} aria-label="Naechster Monat" title="Naechster Monat">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="calendar-grid">
        {days.map((day) => {
          const count = tasks.filter((task) => task.dueDate === day && task.status === 'open').length;
          return (
            <button
              key={day}
              type="button"
              className={`day-button ${day === selectedDate ? 'day-selected' : ''} ${day === todayKey() ? 'day-today' : ''}`}
              onClick={() => onSelectedDate(day)}
            >
              <span>{Number(day.slice(-2))}</span>
              {count > 0 && <small>{count}</small>}
            </button>
          );
        })}
      </div>
      <div className="day-list-head">
        <h2>{formatDateLabel(selectedDate)}</h2>
        <button type="button" className="secondary-button compact" onClick={() => onAddForDate(selectedDate)}>
          Aufgabe
        </button>
      </div>
      {selectedTasks.length === 0 ? (
        <EmptyState title="Keine Aufgaben an diesem Tag" text="Lege eine Aufgabe fuer den ausgewaehlten Tag an." />
      ) : (
        <div className="task-list">
          {selectedTasks.map((task) => (
            <TaskCard key={task.id} task={task} list={lists.find((list) => list.id === task.listId)} {...taskActions} />
          ))}
        </div>
      )}
    </section>
  );
}
