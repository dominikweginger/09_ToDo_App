import { createDefaultList } from '../domain/list-model';
import { ensureDefaultList } from '../domain/list-service';
import { StoredList, getListStore, requestToPromise } from './db';

export async function getAllLists(): Promise<StoredList[]> {
  const store = await getListStore('readonly');
  const lists = ensureDefaultList(await requestToPromise(store.getAll()));
  if (!lists.some((list) => list.id === createDefaultList().id)) await saveList(createDefaultList());
  return lists;
}

export async function saveList(list: StoredList): Promise<void> {
  const store = await getListStore('readwrite');
  await requestToPromise(store.put(list));
}

export async function replaceLists(lists: StoredList[]): Promise<void> {
  const store = await getListStore('readwrite');
  await requestToPromise(store.clear());
  await Promise.all(ensureDefaultList(lists).map((list) => requestToPromise(store.put(list))));
}

export async function deleteList(id: string): Promise<void> {
  const store = await getListStore('readwrite');
  await requestToPromise(store.delete(id));
}
