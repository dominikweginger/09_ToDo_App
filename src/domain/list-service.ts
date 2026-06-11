import { DEFAULT_LIST_ID, TodoList, createDefaultList } from './list-model';
import { createId } from './id-service';

export function ensureDefaultList(lists: TodoList[]): TodoList[] {
  const byId = new Map(lists.map((list) => [list.id, list]));
  if (!byId.has(DEFAULT_LIST_ID)) return [createDefaultList(), ...lists];
  return lists;
}

export function createList(name: string): TodoList {
  const normalized = name.trim();
  if (!normalized) throw new Error('Der Listenname ist erforderlich.');
  const now = new Date().toISOString();
  return {
    id: createId(),
    name: normalized,
    color: null,
    createdAt: now,
    updatedAt: now
  };
}

export function renameList(list: TodoList, name: string): TodoList {
  const normalized = name.trim();
  if (!normalized) throw new Error('Der Listenname ist erforderlich.');
  if (list.id === DEFAULT_LIST_ID) return list;
  return { ...list, name: normalized, updatedAt: new Date().toISOString() };
}

export function isDefaultList(listId: string): boolean {
  return listId === DEFAULT_LIST_ID;
}
