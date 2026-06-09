import { Task } from '../domain/task-model';

const DB_NAME = 'solotodo-db';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TASK_STORE)) {
        const store = db.createObjectStore(TASK_STORE, { keyPath: 'id' });
        store.createIndex('dueDate', 'dueDate', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB konnte nicht geoeffnet werden.'));
  });

  return dbPromise;
}

export async function getTaskStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openDatabase();
  return db.transaction(TASK_STORE, mode).objectStore(TASK_STORE);
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB Anfrage fehlgeschlagen.'));
  });
}

export type StoredTask = Task;
