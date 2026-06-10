import { describe, expect, it } from 'vitest';
import { createDefaultList, DEFAULT_LIST_ID } from '../domain/list-model';
import { createTask } from '../domain/task-service';
import { TaskDraft } from '../domain/task-model';
import { createBackup, parseBackupFile } from './backup-service';

const defaultList = createDefaultList();

function draft(overrides: Partial<TaskDraft> = {}): TaskDraft {
  return {
    title: 'Backup',
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

describe('backup-service', () => {
  it('creates schema version 2 backups with lists', () => {
    const backup = createBackup([createTask(draft())], [defaultList]);

    expect(backup.schemaVersion).toBe(2);
    expect(backup.tasks).toHaveLength(1);
    expect(backup.lists).toHaveLength(1);
  });

  it('rejects invalid JSON files', async () => {
    const file = new File(['not json'], 'bad.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).rejects.toThrow('JSON');
  });

  it('parses valid backups', async () => {
    const backup = createBackup([createTask(draft({ title: 'Import' }))], [defaultList]);
    const file = new File([JSON.stringify(backup)], 'ok.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).resolves.toMatchObject({ schemaVersion: 2, lists: [expect.objectContaining({ id: DEFAULT_LIST_ID })] });
  });

  it('rejects tasks with unknown list references', async () => {
    const backup = createBackup([{ ...createTask(draft()), listId: 'missing' }], [defaultList]);
    const file = new File([JSON.stringify(backup)], 'bad-list.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).rejects.toThrow('Liste');
  });
});
