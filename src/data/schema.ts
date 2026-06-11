export const DB_NAME = 'solotodo-db';
export const DB_VERSION = 2;
export const TASK_STORE = 'tasks';
export const LIST_STORE = 'lists';

export const DB_SCHEMA = {
  [TASK_STORE]: 'id, dueDate, status, listId',
  [LIST_STORE]: 'id'
};
