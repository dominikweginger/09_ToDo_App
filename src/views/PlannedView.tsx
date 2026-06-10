import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { SegmentedControl } from '../components/SegmentedControl';
import { TaskCard } from '../components/TaskCard';
import { formatDateLabel, todayKey } from '../domain/date-utils';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';
import { addDays, isInWeek, weekDays } from '../domain/week-utils';
import { CalendarView } from './CalendarView';

type Mode = 'list' | 'week' | 'calendar';

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

export function PlannedView({ tasks, lists, selectedDate, onSelectedDate, onAddForDate, ...actions }: Props) {
  const [mode, setMode] = useState<Mode>('list');
  const today = todayKey();
  const tomorrow = addDays(today, 1);
  const nextWeekAnchor = addDays(today, 7);
  const laterBoundary = addDays(today, 14);
  const week = weekDays(selectedDate);
  const openDatedTasks = tasks.filter((task) => task.status === 'open' && task.dueDate);

  const sections = useMemo(
    () => [
      { title: 'Heute', tasks: openDatedTasks.filter((task) => task.dueDate === today) },
      { title: 'Morgen', tasks: openDatedTasks.filter((task) => task.dueDate === tomorrow) },
      { title: 'Diese Woche', tasks: openDatedTasks.filter((task) => task.dueDate !== today && task.dueDate !== tomorrow && isInWeek(task.dueDate, today)) },
      { title: 'Naechste Woche', tasks: openDatedTasks.filter((task) => isInWeek(task.dueDate, nextWeekAnchor)) },
      { title: 'Spaeter', tasks: openDatedTasks.filter((task) => task.dueDate! > laterBoundary) }
    ],
    [openDatedTasks, today, tomorrow, nextWeekAnchor, laterBoundary]
  );

  return (
    <section className="view">
      <header className="view-header">
        <h1>Geplant</h1>
        <p>Zeitliche Planung mit Liste, Woche und Kalender.</p>
      </header>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { key: 'list', label: 'Liste' },
          { key: 'week', label: 'Woche' },
          { key: 'calendar', label: 'Kalender' }
        ]}
      />
      {mode === 'list' &&
        sections.map((section) => (
          <section key={section.title} className="section-block">
            <div className="section-head">
              <h2>{section.title}</h2>
              <span>{section.tasks.length}</span>
            </div>
            {section.tasks.length === 0 ? (
              <p className="muted-line">Keine Aufgaben.</p>
            ) : (
              <div className="task-list">
                {sortTasks(section.tasks).map((task) => (
                  <TaskCard key={task.id} task={task} list={lists.find((list) => list.id === task.listId)} {...actions} />
                ))}
              </div>
            )}
          </section>
        ))}
      {mode === 'week' && (
        <>
          <div className="week-strip">
            {week.map((day) => {
              const count = tasks.filter((task) => task.status === 'open' && task.dueDate === day).length;
              return (
                <button key={day} type="button" className={selectedDate === day ? 'week-day selected' : 'week-day'} onClick={() => onSelectedDate(day)}>
                  <span>{new Intl.DateTimeFormat('de-AT', { weekday: 'short' }).format(new Date(day))}</span>
                  <strong>{day.slice(-2)}</strong>
                  <small>{count}</small>
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
          {tasks.filter((task) => task.dueDate === selectedDate && task.status === 'open').length === 0 ? (
            <EmptyState title="Keine Aufgaben an diesem Tag" text="Lege eine Aufgabe fuer den ausgewaehlten Tag an." />
          ) : (
            <div className="task-list">
              {sortTasks(tasks.filter((task) => task.dueDate === selectedDate && task.status === 'open')).map((task) => (
                <TaskCard key={task.id} task={task} list={lists.find((list) => list.id === task.listId)} {...actions} />
              ))}
            </div>
          )}
        </>
      )}
      {mode === 'calendar' && <CalendarView tasks={tasks} lists={lists} selectedDate={selectedDate} onSelectedDate={onSelectedDate} onAddForDate={onAddForDate} {...actions} />}
    </section>
  );
}
