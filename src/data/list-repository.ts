import { createDefaultList } from '../domain/list-model';
import { ensureDefaultList } from '../domain/list-service';
import { StoredList, db, openStorageDatabase } from './db';
import { logStorageError, toStorageError } from './storage-errors';

export async function getAllLists(): Promise<StoredList[]> {
  try {
    await openStorageDatabase();
    const storedLists = await db.lists.toArray();
    const lists = ensureDefaultList(storedLists);
    if (!storedLists.some((list) => list.id === createDefaultList().id)) await db.lists.put(createDefaultList());
    return lists;
  } catch (error) {
    const storageError = toStorageError('DB_READ_FAILED', 'Listen konnten nicht gelesen werden.', error);
    logStorageError('read lists', storageError);
    throw storageError;
  }
}

export async function saveList(list: StoredList): Promise<void> {
  try {
    await openStorageDatabase();
    await db.lists.put(list);
  } catch (error) {
    const storageError = toStorageError('DB_WRITE_FAILED', 'Liste konnte nicht gespeichert werden.', error);
    logStorageError('save list', storageError);
    throw storageError;
  }
}

export async function replaceLists(lists: StoredList[]): Promise<void> {
  try {
    await openStorageDatabase();
    await db.transaction('rw', db.lists, async () => {
      await db.lists.clear();
      await db.lists.bulkPut(ensureDefaultList(lists));
    });
  } catch (error) {
    const storageError = toStorageError('DB_WRITE_FAILED', 'Listen konnten nicht ersetzt werden.', error);
    logStorageError('replace lists', storageError);
    throw storageError;
  }
}

export async function deleteList(id: string): Promise<void> {
  try {
    await openStorageDatabase();
    await db.lists.delete(id);
  } catch (error) {
    const storageError = toStorageError('DB_DELETE_FAILED', 'Liste konnte nicht geloescht werden.', error);
    logStorageError('delete list', storageError);
    throw storageError;
  }
}
