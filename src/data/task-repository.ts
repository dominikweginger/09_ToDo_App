import { StoredTask, db, openStorageDatabase } from './db';
import { logStorageError, toStorageError } from './storage-errors';

export async function getAllTasks(): Promise<StoredTask[]> {
  try {
    await openStorageDatabase();
    return await db.tasks.toArray();
  } catch (error) {
    const storageError = toStorageError('DB_READ_FAILED', 'Aufgaben konnten nicht gelesen werden.', error);
    logStorageError('read tasks', storageError);
    throw storageError;
  }
}

export async function deleteTasksByListId(listId: string): Promise<void> {
  try {
    await openStorageDatabase();
    await db.tasks.where('listId').equals(listId).delete();
  } catch (error) {
    const storageError = toStorageError('DB_DELETE_FAILED', 'Aufgaben der Liste konnten nicht geloescht werden.', error);
    logStorageError('delete tasks by list', storageError);
    throw storageError;
  }
}

export async function saveTask(task: StoredTask): Promise<void> {
  try {
    await openStorageDatabase();
    await db.tasks.put(task);
  } catch (error) {
    const storageError = toStorageError('DB_WRITE_FAILED', 'Aufgabe konnte nicht gespeichert werden.', error);
    logStorageError('save task', storageError);
    throw storageError;
  }
}

export async function saveTasks(tasks: StoredTask[]): Promise<void> {
  try {
    await openStorageDatabase();
    await db.tasks.bulkPut(tasks);
  } catch (error) {
    const storageError = toStorageError('DB_WRITE_FAILED', 'Aufgaben konnten nicht gespeichert werden.', error);
    logStorageError('save tasks', storageError);
    throw storageError;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await openStorageDatabase();
    await db.tasks.delete(id);
  } catch (error) {
    const storageError = toStorageError('DB_DELETE_FAILED', 'Aufgabe konnte nicht geloescht werden.', error);
    logStorageError('delete task', storageError);
    throw storageError;
  }
}

export async function replaceTasks(tasks: StoredTask[]): Promise<void> {
  try {
    await openStorageDatabase();
    await db.transaction('rw', db.tasks, async () => {
      await db.tasks.clear();
      await db.tasks.bulkPut(tasks);
    });
  } catch (error) {
    const storageError = toStorageError('DB_WRITE_FAILED', 'Aufgaben konnten nicht ersetzt werden.', error);
    logStorageError('replace tasks', storageError);
    throw storageError;
  }
}
