import { Task } from '../domain/task-model';
import { validateImportedTask } from '../domain/task-validation';

export const BACKUP_SCHEMA_VERSION = 1;

export interface BackupFile {
  schemaVersion: 1;
  exportedAt: string;
  tasks: Task[];
  categories: [];
}

export function createBackup(tasks: Task[]): BackupFile {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
    categories: []
  };
}

export function downloadBackup(tasks: Task[]): void {
  const blob = new Blob([JSON.stringify(createBackup(tasks), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `solotodo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function parseBackupFile(file: File): Promise<BackupFile> {
  const text = await readFileText(file);
  if (!text.trim()) throw new Error('Die Backup-Datei ist leer.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Die Datei ist kein gueltiges JSON.');
  }

  if (!parsed || typeof parsed !== 'object') throw new Error('Das Backup hat ein ungueltiges Format.');
  const backup = parsed as Partial<BackupFile>;
  if (backup.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error('Die Schema-Version des Backups wird nicht unterstuetzt.');
  }
  if (!Array.isArray(backup.tasks)) throw new Error('Im Backup fehlt die Aufgabenliste.');
  if (!backup.tasks.every(validateImportedTask)) throw new Error('Mindestens eine Aufgabe im Backup ist ungueltig.');

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: typeof backup.exportedAt === 'string' ? backup.exportedAt : new Date().toISOString(),
    tasks: backup.tasks,
    categories: []
  };
}

function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsText(file);
  });
}
