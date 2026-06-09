import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BottomNavigation } from '../components/BottomNavigation';
import { TaskForm } from '../components/TaskForm';
import { createBackup, downloadBackup, parseBackupFile } from '../data/backup-service';
import { deleteTask, getAllTasks, replaceTasks, saveTask } from '../data/task-repository';
import { todayKey } from '../domain/date-utils';
import { Task, TaskDraft } from '../domain/task-model';
import { createTask, moveTaskToDate, toggleTaskDone, updateTask } from '../domain/task-service';
import { CalendarView } from '../views/CalendarView';
import { InboxView } from '../views/InboxView';
import { SettingsView } from '../views/SettingsView';
import { TodayView } from '../views/TodayView';

export type ViewKey = 'today' | 'calendar' | 'inbox' | 'settings';

export function App() {
  const [view, setView] = useState<ViewKey>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getAllTasks()
      .then(setTasks)
      .catch(() => setLoadError('Lokale Daten konnten nicht geladen werden.'));
  }, []);

  const openTasks = useMemo(() => tasks.filter((task) => task.status !== 'archived'), [tasks]);

  function openCreate(date?: string | null) {
    setEditingTask(null);
    setDefaultDate(date ?? null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDefaultDate(null);
    setFormOpen(true);
  }

  async function persistTask(task: Task) {
    await saveTask(task);
    setTasks((current) => current.map((item) => (item.id === task.id ? task : item)));
  }

  async function handleSave(draft: TaskDraft) {
    try {
      if (editingTask) {
        await persistTask(updateTask(editingTask, draft));
      } else {
        const task = createTask(draft, defaultDate ?? undefined);
        await saveTask(task);
        setTasks((current) => [...current, task]);
      }
      setFormOpen(false);
      setMessage('Aufgabe gespeichert.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Aufgabe konnte nicht gespeichert werden.');
    }
  }

  async function handleToggle(task: Task) {
    try {
      await persistTask(toggleTaskDone(task));
    } catch {
      setMessage('Status konnte nicht gespeichert werden.');
    }
  }

  async function handleDelete(task: Task) {
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setMessage('Aufgabe gelöscht.');
    } catch {
      setMessage('Aufgabe konnte nicht gelöscht werden.');
    }
  }

  async function handleMoveDate(task: Task, dueDate: string | null) {
    try {
      await persistTask(moveTaskToDate(task, dueDate));
      setMessage(dueDate ? 'Datum aktualisiert.' : 'Datum entfernt.');
    } catch {
      setMessage('Datum konnte nicht gespeichert werden.');
    }
  }

  async function handleImport(file: File) {
    try {
      const backup = await parseBackupFile(file);
      const confirmed = window.confirm(
        `Import ersetzt ${tasks.length} lokale Aufgaben durch ${backup.tasks.length} Aufgaben aus dem Backup. Fortfahren?`
      );
      if (!confirmed) return;
      await replaceTasks(backup.tasks);
      setTasks(backup.tasks);
      setMessage('Backup importiert.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Backup konnte nicht importiert werden.');
    }
  }

  const taskActions = {
    onToggle: handleToggle,
    onEdit: openEdit,
    onDelete: handleDelete,
    onMoveDate: handleMoveDate
  };

  return (
    <div className="app-shell">
      {loadError && <div className="top-error">{loadError}</div>}
      {view === 'today' && <TodayView tasks={openTasks} {...taskActions} />}
      {view === 'calendar' && (
        <CalendarView
          tasks={openTasks}
          selectedDate={selectedDate}
          onSelectedDate={setSelectedDate}
          onAddForDate={openCreate}
          {...taskActions}
        />
      )}
      {view === 'inbox' && <InboxView tasks={openTasks} {...taskActions} />}
      {view === 'settings' && (
        <SettingsView tasks={openTasks} onExport={() => downloadBackup(openTasks)} onImport={handleImport} {...taskActions} />
      )}

      <button type="button" className="fab" onClick={() => openCreate(view === 'calendar' ? selectedDate : null)}>
        <Plus size={22} aria-hidden="true" />
        <span>Aufgabe</span>
      </button>
      <BottomNavigation activeView={view} onChange={setView} />
      {formOpen && <TaskForm task={editingTask} defaultDate={defaultDate} onSave={handleSave} onCancel={() => setFormOpen(false)} />}
      {message && (
        <button type="button" className="toast" onClick={() => setMessage(null)}>
          {message}
        </button>
      )}
    </div>
  );
}
