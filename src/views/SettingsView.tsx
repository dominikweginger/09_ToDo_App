import { Download, Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { TaskCard } from '../components/TaskCard';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';

interface Props {
  tasks: Task[];
  lists: TodoList[];
  onExport: () => void;
  onImport: (file: File) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleFlag: (task: Task) => void;
  onMoveSort: (task: Task, direction: -1 | 1) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function SettingsView({ tasks, lists, onExport, onImport, onToggle, onEdit, onDelete, onToggleFlag, onMoveSort, onMoveDate }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onImport(file);
    event.target.value = '';
  }

  const visibleTasks = sortTasks(tasks.filter((task) => task.status !== 'archived'));

  return (
    <section className="view">
      <header className="view-header">
        <h1>Mehr</h1>
        <p>Lokale Daten sichern und App-Status pruefen.</p>
      </header>
      <div className="settings-list">
        <div className="settings-row">
          <div>
            <h2>Backup exportieren</h2>
            <p>{tasks.length} Aufgaben und {lists.length} Listen als JSON-Datei speichern.</p>
          </div>
          <button type="button" className="icon-button strong" onClick={onExport} aria-label="Backup exportieren" title="Backup exportieren">
            <Download size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="settings-row">
          <div>
            <h2>Backup importieren</h2>
            <p>Import ersetzt vorhandene Daten erst nach Bestaetigung.</p>
          </div>
          <button type="button" className="icon-button strong" onClick={() => fileInputRef.current?.click()} aria-label="Backup importieren" title="Backup importieren">
            <Upload size={20} aria-hidden="true" />
          </button>
          <input ref={fileInputRef} className="hidden-file" type="file" accept="application/json,.json" onChange={handleFile} />
        </div>
        <div className="app-info">
          <h2>SoloTodo PWA</h2>
          <p>Version 0.2.0 · lokal und offline-first · Backup-Schema v2</p>
        </div>
        <div className="overview-block">
          <div>
            <h2>Alle Aufgaben</h2>
            <p>Gesamtuebersicht mit Liste, Markierung, Prioritaet und Wiederholung.</p>
          </div>
          {visibleTasks.length === 0 ? (
            <p className="muted-line">Noch keine Aufgaben vorhanden.</p>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  list={lists.find((list) => list.id === task.listId)}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFlag={onToggleFlag}
                  onMoveSort={onMoveSort}
                  onMoveDate={onMoveDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
