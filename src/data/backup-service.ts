import { TodoList, createDefaultList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { validateImportedTask } from '../domain/task-validation';
import { normalizeTask } from '../domain/task-service';

export const BACKUP_SCHEMA_VERSION = 2;

export interface BackupFile {
  schemaVersion: 2;
  exportedAt: string;
  tasks: Task[];
  lists: TodoList[];
}

export function createBackup(tasks: Task[], lists: TodoList[]): BackupFile {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
    lists: lists.length ? lists : [createDefaultList()]
  };
}

export function downloadBackup(tasks: Task[], lists: TodoList[]): void {
  const blob = new Blob([JSON.stringify(createBackup(tasks, lists), null, 2)], { type: 'application/json' });
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
  if (!Array.isArray(backup.lists)) throw new Error('Im Backup fehlt die Listenliste.');
  const lists = normalizeLists(backup.lists);
  const listIds = new Set(lists.map((list) => list.id));
  const tasks = backup.tasks.map((task) => normalizeTask(task as Partial<Task>));
  if (!tasks.every(validateImportedTask)) throw new Error('Mindestens eine Aufgabe im Backup ist ungueltig.');
  if (!tasks.every((task) => listIds.has(task.listId))) throw new Error('Mindestens eine Aufgabe verweist auf eine ungueltige Liste.');

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: typeof backup.exportedAt === 'string' ? backup.exportedAt : new Date().toISOString(),
    tasks,
    lists
  };
}

function normalizeLists(lists: unknown[]): TodoList[] {
  const now = new Date().toISOString();
  const normalized = lists
    .filter((list): list is Partial<TodoList> => Boolean(list && typeof list === 'object'))
    .filter((list) => typeof list.id === 'string' && typeof list.name === 'string')
    .map((list) => ({
      id: list.id!,
      name: list.name!,
      color: list.color ?? null,
      createdAt: list.createdAt ?? now,
      updatedAt: list.updatedAt ?? now
    }));
  return normalized.some((list) => list.id === createDefaultList().id) ? normalized : [createDefaultList(), ...normalized];
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
