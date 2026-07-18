import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoList, createDefaultList } from '../domain/list-model';
import { Task } from '../domain/task-model';
import { SettingsView } from './SettingsView';

const lists: TodoList[] = [
  createDefaultList('2026-06-14T08:00:00.000Z'),
  { id: 'normal', name: 'Normal', color: null, isChecklist: false, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' },
  { id: 'check', name: 'Einkauf', color: null, isChecklist: true, createdAt: '2026-06-14T08:00:00.000Z', updatedAt: '2026-06-14T08:00:00.000Z' }
];

function task(overrides: Partial<Task>): Task {
  return {
    id: 'task', title: 'Aufgabe', description: null, status: 'open', listId: 'normal', dueDate: null, dueTime: null,
    priority: 'none', isFlagged: false, recurrence: null, sortOrder: 1, createdAt: '2026-06-14T08:00:00.000Z',
    updatedAt: '2026-06-14T08:00:00.000Z', completedAt: null, ...overrides
  };
}

describe('SettingsView checklist visibility', () => {
  it('filters only All Tasks while keeping backup count and export callback complete', () => {
    const onExport = vi.fn();
    render(
      <SettingsView
        tasks={[
          task({ id: 'normal', title: 'Normale Aufgabe' }),
          task({ id: 'hidden-open', title: 'Versteckt offen', listId: 'check' }),
          task({ id: 'hidden-done', title: 'Versteckt erledigt', listId: 'check', status: 'done' }),
          task({ id: 'dated', title: 'Datierte Checklistenaufgabe', listId: 'check', dueDate: '2026-06-20' })
        ]}
        lists={lists}
        onExport={onExport}
        onImport={vi.fn()}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleFlag={vi.fn()}
        onMoveSort={vi.fn()}
        onMoveDate={vi.fn()}
        appVersion="test"
      />
    );

    expect(screen.getByText('4 Aufgaben und 3 Listen als JSON-Datei speichern.')).toBeInTheDocument();
    expect(screen.getByText('Normale Aufgabe')).toBeInTheDocument();
    expect(screen.getByText('Datierte Checklistenaufgabe')).toBeInTheDocument();
    expect(screen.queryByText('Versteckt offen')).not.toBeInTheDocument();
    expect(screen.queryByText('Versteckt erledigt')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Backup exportieren' }));
    expect(onExport).toHaveBeenCalledTimes(1);
  });
});
