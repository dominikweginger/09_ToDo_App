import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDefaultList, DEFAULT_LIST_ID } from '../domain/list-model';
import { TaskDraft } from '../domain/task-model';
import { createTask } from '../domain/task-service';
import { createId } from '../domain/id-service';
import { createBackup, parseBackupFile, replaceAllData } from './backup-service';
import { db, openStorageDatabase } from './db';
import { getAllLists, saveList } from './list-repository';
import { deleteTask, getAllTasks, saveTask } from './task-repository';
import { runStorageDiagnostics } from './storage-diagnostics';
import { StorageError } from './storage-errors';

const defaultList = createDefaultList();

function draft(overrides: Partial<TaskDraft> = {}): TaskDraft {
  return {
    title: 'Storage Test',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'none',
    listId: DEFAULT_LIST_ID,
    isFlagged: false,
    recurrence: null,
    status: 'open',
    ...overrides
  };
}

afterEach(async () => {
  vi.unstubAllGlobals();
  db.close();
  await db.delete();
});

describe('Dexie storage', () => {
  it('saves, loads, and deletes tasks', async () => {
    const task = createTask(draft({ title: 'Persistente Aufgabe' }));

    await saveTask(task);
    expect(await getAllTasks()).toEqual([task]);

    await deleteTask(task.id);
    expect(await getAllTasks()).toEqual([]);
  });

  it('saves and loads lists while ensuring the default list', async () => {
    await saveList({ id: 'work', name: 'Arbeit', color: null, createdAt: '2026-06-11T00:00:00.000Z', updatedAt: '2026-06-11T00:00:00.000Z' });

    const lists = await getAllLists();

    expect(lists).toEqual(expect.arrayContaining([expect.objectContaining({ id: DEFAULT_LIST_ID }), expect.objectContaining({ id: 'work' })]));
  });

  it('replaces tasks and lists atomically during import', async () => {
    const task = createTask(draft({ title: 'Importiert' }));
    const backup = createBackup([task], [defaultList]);

    await replaceAllData(backup);

    expect(await getAllTasks()).toEqual([task]);
    expect(await getAllLists()).toEqual([defaultList]);
  });

  it('does not delete existing data when backup parsing fails', async () => {
    const task = createTask(draft({ title: 'Bleibt erhalten' }));
    await saveTask(task);

    const invalidFile = new File(['not json'], 'bad.json', { type: 'application/json' });
    await expect(parseBackupFile(invalidFile)).rejects.toMatchObject({ code: 'DB_IMPORT_VALIDATION_FAILED' });

    expect(await getAllTasks()).toEqual([task]);
  });

  it('does not delete existing data when atomic replace validation fails', async () => {
    const existing = createTask(draft({ title: 'Bleibt atomar erhalten' }));
    const invalid = { ...createTask(draft({ title: 'Ungueltig' })), listId: 'missing-list' };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await saveTask(existing);

    try {
      await expect(replaceAllData(createBackup([invalid], [defaultList]))).rejects.toMatchObject({ code: 'DB_IMPORT_VALIDATION_FAILED' });
      expect(await getAllTasks()).toEqual([existing]);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('throws StorageError codes when IndexedDB is unavailable', async () => {
    db.close();
    vi.stubGlobal('indexedDB', undefined);

    await expect(openStorageDatabase()).rejects.toMatchObject({ code: 'DB_NOT_AVAILABLE' });
  });

  it('creates IDs without crypto.randomUUID', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: (array: Uint8Array) => {
        array.fill(1);
        return array;
      }
    });

    expect(createId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('returns diagnostics without task titles or notes', async () => {
    const task = createTask(draft({ title: 'Geheimer Titel', description: 'Geheime Notiz' }));
    await saveTask(task);

    const report = await runStorageDiagnostics('test-version');

    expect(report.text).toContain('SoloTodo Speicherdiagnose');
    expect(report.text).toContain('Anzahl Aufgaben: 1');
    expect(report.text).not.toContain('Geheimer Titel');
    expect(report.text).not.toContain('Geheime Notiz');
  });

  it('keeps validation errors distinguishable from generic errors', () => {
    const error = new StorageError('DB_READ_FAILED', 'Lesefehler');
    expect(error.code).toBe('DB_READ_FAILED');
  });
});
