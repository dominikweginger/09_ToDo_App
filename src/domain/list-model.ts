export const DEFAULT_LIST_ID = 'default-list';

export interface TodoList {
  id: string;
  name: string;
  color: string | null;
  isChecklist: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListDraft {
  name: string;
  isChecklist: boolean;
}

export function createDefaultList(now = new Date().toISOString()): TodoList {
  return {
    id: DEFAULT_LIST_ID,
    name: 'Allgemein',
    color: '#2563eb',
    isChecklist: false,
    createdAt: now,
    updatedAt: now
  };
}
