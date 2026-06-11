import Dexie, { type Table } from 'dexie';
import { TodoList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { DB_NAME, DB_SCHEMA, DB_VERSION, LIST_STORE, TASK_STORE } from './schema';
import { StorageError, logStorageError, toStorageError } from './storage-errors';

export type StoredTask = Task;
export type StoredList = TodoList;

export class SoloTodoDb extends Dexie {
  tasks!: Table<StoredTask, string>;
  lists!: Table<StoredList, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(DB_SCHEMA);

    this.on('blocked', () => {
      const error = new StorageError('DB_BLOCKED', 'Datenbank-Update ist blockiert.');
      logStorageError('blocked', error);
      globalThis.dispatchEvent?.(new CustomEvent('solotodo:storage-error', { detail: error }));
    });

    this.on('versionchange', () => {
      this.close();
      const error = new StorageError('DB_VERSION_CHANGED', 'Datenbankversion wurde extern geaendert.');
      logStorageError('versionchange', error);
      globalThis.dispatchEvent?.(new CustomEvent('solotodo:storage-error', { detail: error }));
    });
  }
}

export const db = new SoloTodoDb();

export async function openStorageDatabase(): Promise<SoloTodoDb> {
  if (typeof globalThis.indexedDB === 'undefined') throw new StorageError('DB_NOT_AVAILABLE', 'IndexedDB ist nicht verfuegbar.');
  try {
    if (!db.isOpen()) await db.open();
    await assertRequiredStores();
    return db;
  } catch (error) {
    const storageError = toStorageError('DB_OPEN_FAILED', 'Lokale Datenbank konnte nicht geoeffnet werden.', error);
    logStorageError('open database', storageError);
    db.close();
    throw storageError;
  }
}

export async function assertRequiredStores(): Promise<void> {
  const tableNames = new Set(db.tables.map((table) => table.name));
  if (!tableNames.has(TASK_STORE) || !tableNames.has(LIST_STORE)) {
    throw new StorageError('DB_STORE_MISSING', 'Erforderliche Datentabellen fehlen.');
  }
}
