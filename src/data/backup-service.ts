import { TodoList, createDefaultList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { validateImportedTask } from '../domain/task-validation';
import { normalizeTask } from '../domain/task-service';
import { ensureDefaultList, normalizeList } from '../domain/list-service';
import { db, openStorageDatabase } from './db';
import { logStorageError, toStorageError } from './storage-errors';

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
  if (!text.trim()) throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Die Backup-Datei ist leer.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Die Datei ist kein gueltiges JSON.');
  }

  if (!parsed || typeof parsed !== 'object') throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Das Backup hat ein ungueltiges Format.');
  const backup = parsed as Partial<BackupFile>;
  if (backup.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Die Schema-Version des Backups wird nicht unterstuetzt.');
  }
  if (!Array.isArray(backup.tasks)) throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Im Backup fehlt die Aufgabenliste.');
  if (!Array.isArray(backup.lists)) throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Im Backup fehlt die Listenliste.');
  const lists = normalizeLists(backup.lists);
  const listIds = new Set(lists.map((list) => list.id));
  const tasks = backup.tasks.map((task) => normalizeTask(task as Partial<Task>));
  if (!tasks.every(validateImportedTask)) throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Mindestens eine Aufgabe im Backup ist ungueltig.');
  if (!tasks.every((task) => listIds.has(task.listId))) throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Mindestens eine Aufgabe verweist auf eine ungueltige Liste.');

  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: typeof backup.exportedAt === 'string' ? backup.exportedAt : new Date().toISOString(),
    tasks,
    lists
  };
}

export async function replaceAllData(backup: BackupFile): Promise<void> {
  try {
    await openStorageDatabase();
    const lists = ensureDefaultList(backup.lists);
    const listIds = new Set(lists.map((list) => list.id));
    if (!backup.tasks.every(validateImportedTask) || !backup.tasks.every((task) => listIds.has(task.listId))) {
      throw toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Importdaten sind ungueltig.');
    }

    await db.transaction('rw', db.lists, db.tasks, async () => {
      await db.lists.clear();
      await db.tasks.clear();
      await db.lists.bulkPut(lists);
      await db.tasks.bulkPut(backup.tasks);
    });
  } catch (error) {
    const storageError = toStorageError('DB_IMPORT_TRANSACTION_FAILED', 'Backup konnte nicht atomar importiert werden.', error);
    logStorageError('replace all data', storageError);
    throw storageError;
  }
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
      isChecklist: list.isChecklist === true,
      createdAt: list.createdAt ?? now,
      updatedAt: list.updatedAt ?? now
    }))
    .map(normalizeList);
  return ensureDefaultList(normalized);
}

function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(toStorageError('DB_IMPORT_VALIDATION_FAILED', 'Datei konnte nicht gelesen werden.', reader.error));
    reader.readAsText(file);
  });
}
