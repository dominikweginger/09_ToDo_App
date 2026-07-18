import { describe, expect, it } from 'vitest';
import { DEFAULT_LIST_ID, TodoList, createDefaultList } from './list-model';
import { createList, ensureDefaultList, normalizeList, updateList } from './list-service';

const timestamp = '2026-06-14T08:00:00.000Z';

function list(overrides: Partial<TodoList> = {}): TodoList {
  return {
    id: 'list-1',
    name: 'Liste',
    color: '#123456',
    isChecklist: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides
  };
}

describe('list-service', () => {
  it('creates the protected default list as a normal list', () => {
    expect(createDefaultList(timestamp)).toEqual({
      id: DEFAULT_LIST_ID,
      name: 'Allgemein',
      color: '#2563eb',
      isChecklist: false,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });

  it.each([false, true])('creates a trimmed list with isChecklist=%s', (isChecklist) => {
    expect(createList({ name: '  Einkauf  ', isChecklist })).toMatchObject({ name: 'Einkauf', color: null, isChecklist });
  });

  it('updates editable fields while preserving list identity and metadata', () => {
    const original = list();
    const updated = updateList(original, { name: '  Neu  ', isChecklist: true });

    expect(updated).toMatchObject({ id: original.id, name: 'Neu', color: original.color, isChecklist: true, createdAt: original.createdAt });
    expect(updated.updatedAt).not.toBe(original.updatedAt);
    expect(original).toEqual(list());
  });

  it('does not update the default list', () => {
    const defaultList = createDefaultList(timestamp);
    expect(updateList(defaultList, { name: 'Andere', isChecklist: true })).toBe(defaultList);
  });

  it.each([undefined, null, 'true', 1, false])('normalizes invalid or missing checklist value %s to false', (value) => {
    const candidate = { ...list(), isChecklist: value } as unknown as TodoList;
    expect(normalizeList(candidate).isChecklist).toBe(false);
  });

  it('keeps only literal true and forces the default list to false', () => {
    expect(normalizeList(list({ isChecklist: true })).isChecklist).toBe(true);
    expect(normalizeList(list({ id: DEFAULT_LIST_ID, isChecklist: true })).isChecklist).toBe(false);
  });

  it('normalizes every list and supplies a protected default without changing valid metadata', () => {
    const valid = list({ id: 'checklist', name: 'Einkauf', isChecklist: true });
    const result = ensureDefaultList([valid]);

    expect(result[0]).toMatchObject({ id: DEFAULT_LIST_ID, isChecklist: false });
    expect(result[1]).toEqual(valid);
  });
});
