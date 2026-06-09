import { describe, expect, it } from 'vitest';
import { createBackup, parseBackupFile } from './backup-service';
import { createTask } from '../domain/task-service';

describe('backup-service', () => {
  it('creates schema version 1 backups', () => {
    const backup = createBackup([
      createTask({ title: 'Backup', description: '', dueDate: '', dueTime: '', priority: 'none', status: 'open' })
    ]);

    expect(backup.schemaVersion).toBe(1);
    expect(backup.tasks).toHaveLength(1);
  });

  it('rejects invalid JSON files', async () => {
    const file = new File(['not json'], 'bad.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).rejects.toThrow('JSON');
  });

  it('parses valid backups', async () => {
    const backup = createBackup([
      createTask({ title: 'Import', description: '', dueDate: '', dueTime: '', priority: 'none', status: 'open' })
    ]);
    const file = new File([JSON.stringify(backup)], 'ok.json', { type: 'application/json' });
    await expect(parseBackupFile(file)).resolves.toMatchObject({ schemaVersion: 1 });
  });
});
