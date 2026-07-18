import { DEFAULT_LIST_ID, ListDraft, TodoList, createDefaultList } from './list-model';
import { createId } from './id-service';

export function ensureDefaultList(lists: TodoList[]): TodoList[] {
  const normalized = lists.map(normalizeList);
  if (!normalized.some((list) => list.id === DEFAULT_LIST_ID)) return [createDefaultList(), ...normalized];
  return normalized;
}

export function normalizeList(list: TodoList): TodoList {
  return {
    ...list,
    isChecklist: list.id === DEFAULT_LIST_ID ? false : list.isChecklist === true
  };
}

export function createList(draft: ListDraft): TodoList {
  const normalizedName = draft.name.trim();
  if (!normalizedName) throw new Error('Der Listenname ist erforderlich.');
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: normalizedName,
    color: null,
    isChecklist: draft.isChecklist === true,
    createdAt: now,
    updatedAt: now
  };
}

export function updateList(list: TodoList, draft: ListDraft): TodoList {
  const normalizedName = draft.name.trim();
  if (!normalizedName) throw new Error('Der Listenname ist erforderlich.');
  if (list.id === DEFAULT_LIST_ID) return list;
  return {
    ...list,
    name: normalizedName,
    isChecklist: draft.isChecklist === true,
    updatedAt: new Date().toISOString()
  };
}

export function isDefaultList(listId: string): boolean {
  return listId === DEFAULT_LIST_ID;
}
