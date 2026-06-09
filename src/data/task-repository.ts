import { StoredTask, getTaskStore, requestToPromise } from './db';

export async function getAllTasks(): Promise<StoredTask[]> {
  const store = await getTaskStore('readonly');
  return requestToPromise(store.getAll());
}

export async function saveTask(task: StoredTask): Promise<void> {
  const store = await getTaskStore('readwrite');
  await requestToPromise(store.put(task));
}

export async function saveTasks(tasks: StoredTask[]): Promise<void> {
  const store = await getTaskStore('readwrite');
  await Promise.all(tasks.map((task) => requestToPromise(store.put(task))));
}

export async function deleteTask(id: string): Promise<void> {
  const store = await getTaskStore('readwrite');
  await requestToPromise(store.delete(id));
}

export async function replaceTasks(tasks: StoredTask[]): Promise<void> {
  const store = await getTaskStore('readwrite');
  await requestToPromise(store.clear());
  await Promise.all(tasks.map((task) => requestToPromise(store.put(task))));
}
