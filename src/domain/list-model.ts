export const DEFAULT_LIST_ID = 'default-list';

export interface TodoList {
  id: string;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createDefaultList(now = new Date().toISOString()): TodoList {
  return {
    id: DEFAULT_LIST_ID,
    name: 'Allgemein',
    color: '#2563eb',
    createdAt: now,
    updatedAt: now
  };
}
