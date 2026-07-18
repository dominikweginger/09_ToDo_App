import { describe, expect, it } from 'vitest';
import { createDefaultList, DEFAULT_LIST_ID, TodoList } from '../domain/list-model';
import { createTask } from '../domain/task-service';
import { TaskDraft } from '../domain/task-model';
import { BACKUP_SCHEMA_VERSION, createBackup, parseBackupFile } from './backup-service';

const defaultList = createDefaultList();
const checklist: TodoList = {
  id: 'checklist',
  name: 'Einkauf',
  color: null,
  isChecklist: true,
  createdAt: '2026-06-14T08:00:00.000Z',
  updatedAt: '2026-06-14T08:00:00.000Z'
};

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
    expect(BACKUP_SCHEMA_VERSION).toBe(2);
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

  it('roundtrips checklist metadata and keeps undated checklist tasks in the unchanged export scope', async () => {
    const undatedChecklistTask = createTask(draft({ title: 'Milch', listId: checklist.id, dueDate: '' }));
    const backup = createBackup([undatedChecklistTask], [defaultList, checklist]);
    const file = new File([JSON.stringify(backup)], 'checklist.json', { type: 'application/json' });
    const parsed = await parseBackupFile(file);

    expect(backup.tasks).toEqual([undatedChecklistTask]);
    expect(backup.lists).toEqual([defaultList, checklist]);
    expect(parsed.tasks).toEqual([undatedChecklistTask]);
    expect(parsed.lists).toEqual([defaultList, checklist]);
  });

  it.each([undefined, null, 'true', 1])('normalizes legacy or invalid checklist value %s to false', async (isChecklist) => {
    const legacyList = { ...checklist, id: 'legacy' } as Record<string, unknown>;
    if (isChecklist === undefined) delete legacyList.isChecklist;
    else legacyList.isChecklist = isChecklist;
    const backup = {
      schemaVersion: 2,
      exportedAt: '2026-06-14T08:00:00.000Z',
      tasks: [createTask(draft({ listId: 'legacy' }))],
      lists: [defaultList, legacyList]
    };

    const parsed = await parseBackupFile(new File([JSON.stringify(backup)], 'legacy.json', { type: 'application/json' }));
    expect(parsed.lists.find((list) => list.id === 'legacy')?.isChecklist).toBe(false);
  });

  it('forces an imported default list to remain normal', async () => {
    const backup = createBackup([createTask(draft())], [{ ...defaultList, isChecklist: true }]);
    const parsed = await parseBackupFile(new File([JSON.stringify(backup)], 'default.json', { type: 'application/json' }));

    expect(parsed.lists).toEqual([expect.objectContaining({ id: DEFAULT_LIST_ID, isChecklist: false })]);
  });

  it('rejects tasks with unknown list references', async () => {
    const backup = createBackup([{ ...createTask(draft()), listId: 'missing' }], [defaultList]);
    const file = new File([JSON.stringify(backup)], 'bad-list.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).rejects.toThrow('Liste');
  });
});
