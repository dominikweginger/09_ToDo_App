import { Download, Upload } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../domain/task-model';
import { sortTasks } from '../domain/task-service';

interface Props {
  tasks: Task[];
  onExport: () => void;
  onImport: (file: File) => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMoveDate: (task: Task, dueDate: string | null) => void;
}

export function SettingsView({ tasks, onExport, onImport, onToggle, onEdit, onDelete, onMoveDate }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const taskCount = tasks.length;

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onImport(file);
    event.target.value = '';
  }

  const visibleTasks = sortTasks(tasks);

  return (
    <section className="view">
      <header className="view-header">
        <h1>Mehr</h1>
        <p>Lokale Daten sichern und App-Status prüfen.</p>
      </header>
      <div className="settings-list">
        <div className="settings-row">
          <div>
            <h2>Backup exportieren</h2>
            <p>{taskCount} Aufgaben als JSON-Datei speichern.</p>
          </div>
          <button type="button" className="icon-button strong" onClick={onExport} aria-label="Backup exportieren" title="Backup exportieren">
            <Download size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="settings-row">
          <div>
            <h2>Backup importieren</h2>
            <p>Import ersetzt vorhandene Aufgaben erst nach Bestätigung.</p>
          </div>
          <button type="button" className="icon-button strong" onClick={() => fileInputRef.current?.click()} aria-label="Backup importieren" title="Backup importieren">
            <Upload size={20} aria-hidden="true" />
          </button>
          <input ref={fileInputRef} className="hidden-file" type="file" accept="application/json,.json" onChange={handleFile} />
        </div>
        <div className="app-info">
          <h2>SoloTodo PWA</h2>
          <p>Version 0.1.0 · MVP · lokal und offline-first</p>
        </div>
        <div className="overview-block">
          <div>
            <h2>Alle Aufgaben</h2>
            <p>Einfache Gesamtübersicht über lokale Aufgaben.</p>
          </div>
          {visibleTasks.length === 0 ? (
            <p className="muted-line">Noch keine Aufgaben vorhanden.</p>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
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
