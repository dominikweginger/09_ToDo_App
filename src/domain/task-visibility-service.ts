import { TodoList } from './list-model';
import { Task } from './task-model';

export function getTasksVisibleOutsideOwnList(tasks: Task[], lists: TodoList[]): Task[] {
  const checklistListIds = new Set(lists.filter((list) => list.isChecklist === true).map((list) => list.id));
  return tasks.filter((task) => Boolean(task.dueDate) || !checklistListIds.has(task.listId));
}
