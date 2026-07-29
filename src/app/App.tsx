import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomNavigation } from '../components/BottomNavigation';
import { ListFormSheet } from '../components/ListFormSheet';
import { TaskForm } from '../components/TaskForm';
import { downloadBackup, parseBackupFile, replaceAllData } from '../data/backup-service';
import { deleteList as deleteStoredList, getAllLists, saveList } from '../data/list-repository';
import { deleteTask, deleteTasksByListId, getAllTasks, saveTask } from '../data/task-repository';
import { isStorageError, logStorageError, storageErrorToUserMessage } from '../data/storage-errors';
import { todayKey } from '../domain/date-utils';
import { DEFAULT_LIST_ID, ListDraft, TodoList } from '../domain/list-model';
import { createList, ensureDefaultList, isDefaultList, updateList } from '../domain/list-service';
import { SmartViewKey } from '../domain/smart-view-service';
import { Task, TaskDraft } from '../domain/task-model';
import { createTask, moveTaskToDate, normalizeTask, toggleTaskDone, updateTask } from '../domain/task-service';
import { DashboardView } from '../views/DashboardView';
import { ListDetailView } from '../views/ListDetailView';
import { ListsView } from '../views/ListsView';
import { PlannedView } from '../views/PlannedView';
import { SettingsView } from '../views/SettingsView';
import { SmartViewDetailView } from '../views/SmartViewDetailView';

export type ViewKey = 'dashboard' | 'planned' | 'lists' | 'settings';

type FormDefaults = {
  date?: string | null;
  listId?: string | null;
  flagged?: boolean;
  priority?: TaskDraft['priority'];
};

type ListSheetState =
  | { mode: 'create'; list: null }
  | { mode: 'edit'; list: TodoList };

function errorToMessage(error: unknown, fallback: string): string {
  if (isStorageError(error)) return storageErrorToUserMessage(error);
  if (error instanceof Error && !/failed to execute|domexception/i.test(error.message)) return error.message;
  return fallback;
}

const LIST_DETAIL_HISTORY_MARKER = 'list-detail';

function isListDetailHistoryState(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'solotodoSubView' in state
    && state.solotodoSubView === LIST_DETAIL_HISTORY_MARKER;
}

export function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [smartView, setSmartView] = useState<SmartViewKey | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<FormDefaults>({});
  const [listSheet, setListSheet] = useState<ListSheetState | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [applyUpdate, setApplyUpdate] = useState<(() => void) | null>(null);

  useEffect(() => {
    Promise.all([getAllTasks(), getAllLists()])
      .then(([storedTasks, storedLists]) => {
        const safeLists = ensureDefaultList(storedLists);
        const listIds = new Set(safeLists.map((list) => list.id));
        setLists(safeLists);
        setTasks(storedTasks.map((task) => normalizeTask(task, listIds.has(task.listId) ? task.listId : DEFAULT_LIST_ID)));
      })
      .catch((error) => {
        logStorageError('initial load', error);
        setLoadError(errorToMessage(error, 'Lokale Daten konnten nicht geladen werden.'));
      });
  }, []);

  useEffect(() => {
    const handleUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent<{ updateServiceWorker?: (reloadPage?: boolean) => Promise<void> }>;
      setApplyUpdate(() => () => {
        void customEvent.detail?.updateServiceWorker?.(true);
      });
      setUpdateAvailable(true);
    };
    window.addEventListener('solotodo:update-available', handleUpdateAvailable);
    return () => window.removeEventListener('solotodo:update-available', handleUpdateAvailable);
  }, []);

  useEffect(() => {
    const handleStorageError = (event: Event) => {
      const error = (event as CustomEvent<unknown>).detail;
      logStorageError('runtime storage event', error);
      setMessage(errorToMessage(error, 'Lokaler Speicherstatus hat sich geaendert. Bitte neu laden oder Speicherdiagnose ausfuehren.'));
    };
    window.addEventListener('solotodo:storage-error', handleStorageError);
    return () => window.removeEventListener('solotodo:storage-error', handleStorageError);
  }, []);

  const visibleTasks = useMemo(() => tasks.filter((task) => task.status !== 'archived'), [tasks]);
  const currentList = lists.find((list) => list.id === selectedListId) ?? lists.find((list) => list.id === DEFAULT_LIST_ID);

  const closeListDetail = useCallback((historyAlreadyChanged = false) => {
    setSelectedListId(null);
    if (!historyAlreadyChanged && isListDetailHistoryState(window.history.state)) {
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => closeListDetail(true);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [closeListDetail]);

  function openCreate(defaults: FormDefaults = {}) {
    setEditingTask(null);
    setFormDefaults(defaults);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormDefaults({});
    setFormOpen(true);
  }

  function openSmartView(next: SmartViewKey) {
    setSmartView(next);
    setSelectedListId(null);
    if (next === 'planned') setView('planned');
  }

  function openList(listId: string) {
    if (selectedListId === null) {
      const currentState = typeof window.history.state === 'object' && window.history.state !== null
        ? window.history.state
        : {};
      window.history.pushState(
        { ...currentState, solotodoSubView: LIST_DETAIL_HISTORY_MARKER, listId },
        ''
      );
    }
    setSelectedListId(listId);
    setSmartView(null);
    setView('lists');
  }

  async function persistTask(task: Task) {
    await saveTask(task);
    setTasks((current) => current.map((item) => (item.id === task.id ? task : item)));
  }

  async function handleSave(draft: TaskDraft) {
    try {
      if (editingTask) {
        await persistTask(updateTask(editingTask, draft));
      } else {
        const task = createTask(draft, formDefaults.date ?? undefined, Date.now());
        await saveTask(task);
        setTasks((current) => [...current, task]);
      }
      setFormOpen(false);
      setMessage('Aufgabe gespeichert.');
    } catch (error) {
      logStorageError('save task ui', error);
      setMessage(errorToMessage(error, 'Aufgabe konnte nicht gespeichert werden.'));
    }
  }

  async function handleToggle(task: Task) {
    try {
      await persistTask(toggleTaskDone(task));
    } catch (error) {
      logStorageError('toggle task ui', error);
      setMessage(errorToMessage(error, 'Status konnte nicht gespeichert werden.'));
    }
  }

  async function handleToggleFlag(task: Task) {
    try {
      await persistTask({ ...task, isFlagged: !task.isFlagged, updatedAt: new Date().toISOString() });
    } catch (error) {
      logStorageError('toggle flag ui', error);
      setMessage(errorToMessage(error, 'Markierung konnte nicht gespeichert werden.'));
    }
  }

  async function handleDelete(task: Task) {
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setMessage('Aufgabe geloescht.');
    } catch (error) {
      logStorageError('delete task ui', error);
      setMessage(errorToMessage(error, 'Aufgabe konnte nicht geloescht werden.'));
    }
  }

  async function handleMoveDate(task: Task, dueDate: string | null) {
    try {
      await persistTask(moveTaskToDate(task, dueDate));
      setMessage(dueDate ? 'Datum aktualisiert.' : 'Datum entfernt.');
    } catch (error) {
      logStorageError('move date ui', error);
      setMessage(errorToMessage(error, 'Datum konnte nicht gespeichert werden.'));
    }
  }

  async function handleMoveSort(task: Task, direction: -1 | 1) {
    const listTasks = visibleTasks.filter((item) => item.listId === task.listId && item.status === 'open').sort((a, b) => a.sortOrder - b.sortOrder);
    const index = listTasks.findIndex((item) => item.id === task.id);
    const swap = listTasks[index + direction];
    if (!swap) return;
    const first = { ...task, sortOrder: swap.sortOrder, updatedAt: new Date().toISOString() };
    const second = { ...swap, sortOrder: task.sortOrder, updatedAt: new Date().toISOString() };
    try {
      await saveTask(first);
      await saveTask(second);
      setTasks((current) => current.map((item) => (item.id === first.id ? first : item.id === second.id ? second : item)));
    } catch (error) {
      logStorageError('move sort ui', error);
      setMessage(errorToMessage(error, 'Sortierung konnte nicht gespeichert werden.'));
    }
  }

  function handleCreateList() {
    setListSheet({ mode: 'create', list: null });
  }

  async function saveCreatedList(draft: ListDraft) {
    try {
      const list = createList(draft);
      await saveList(list);
      setLists((current) => [...current, list]);
      setMessage('Liste erstellt.');
    } catch (error) {
      logStorageError('create list ui', error);
      throw new Error(errorToMessage(error, 'Liste konnte nicht erstellt werden.'));
    }
  }

  function handleEditList(list: TodoList) {
    if (isDefaultList(list.id)) return;
    setListSheet({ mode: 'edit', list });
  }

  async function saveEditedList(list: TodoList, draft: ListDraft) {
    try {
      const updated = updateList(list, draft);
      await saveList(updated);
      setLists((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setMessage('Liste bearbeitet.');
    } catch (error) {
      logStorageError('edit list ui', error);
      throw new Error(errorToMessage(error, 'Liste konnte nicht bearbeitet werden.'));
    }
  }

  async function handleDeleteList(list: TodoList) {
    if (isDefaultList(list.id)) return;
    const affected = tasks.filter((task) => task.listId === list.id).length;
    if (affected > 0 && !window.confirm(`Diese Liste enthaelt ${affected} Aufgaben. Liste und Aufgaben loeschen?`)) return;
    try {
      await deleteTasksByListId(list.id);
      await deleteStoredList(list.id);
      setTasks((current) => current.filter((task) => task.listId !== list.id));
      setLists((current) => current.filter((item) => item.id !== list.id));
      if (selectedListId === list.id) setSelectedListId(DEFAULT_LIST_ID);
      setMessage('Liste geloescht.');
    } catch (error) {
      logStorageError('delete list ui', error);
      setMessage(errorToMessage(error, 'Liste konnte nicht geloescht werden.'));
    }
  }

  async function handleImport(file: File) {
    try {
      const backup = await parseBackupFile(file);
      const confirmed = window.confirm(
        `Import ersetzt ${tasks.length} Aufgaben und ${lists.length} Listen durch ${backup.tasks.length} Aufgaben und ${backup.lists.length} Listen. Fortfahren?`
      );
      if (!confirmed) return;
      const safeLists = ensureDefaultList(backup.lists);
      await replaceAllData({ ...backup, lists: safeLists });
      setLists(safeLists);
      setTasks(backup.tasks);
      setSelectedListId(null);
      setSmartView(null);
      setMessage('Backup importiert.');
    } catch (error) {
      logStorageError('import backup ui', error);
      setMessage(errorToMessage(error, 'Backup konnte nicht importiert werden.'));
    }
  }

  const taskActions = {
    onToggle: handleToggle,
    onEdit: openEdit,
    onDelete: handleDelete,
    onToggleFlag: handleToggleFlag,
    onMoveDate: handleMoveDate
  };

  const fabDefaults: FormDefaults =
    selectedListId ? { listId: selectedListId } :
    smartView === 'today' ? { date: todayKey() } :
    smartView === 'no-date' ? { date: null } :
    smartView === 'flagged' ? { flagged: true } :
    smartView === 'urgent' ? { priority: 'high' } :
    view === 'planned' ? { date: selectedDate } :
    {};

  return (
    <div className="app-shell">
      {loadError && <div className="top-error">{loadError}</div>}
      {view === 'dashboard' && !smartView && <DashboardView tasks={visibleTasks} lists={lists} onOpenSmartView={openSmartView} onOpenList={openList} />}
      {smartView && view !== 'planned' && (
        <SmartViewDetailView smartView={smartView} tasks={visibleTasks} lists={lists} onCreate={(defaults = {}) => openCreate(defaults)} {...taskActions} />
      )}
      {view === 'planned' && (
        <PlannedView tasks={visibleTasks} lists={lists} selectedDate={selectedDate} onSelectedDate={setSelectedDate} onAddForDate={(date) => openCreate({ date })} {...taskActions} />
      )}
      {view === 'lists' && !selectedListId && (
        <ListsView tasks={visibleTasks} lists={lists} onCreateList={handleCreateList} onEditList={handleEditList} onDeleteList={handleDeleteList} onOpenList={openList} />
      )}
      {view === 'lists' && selectedListId && currentList && (
        <ListDetailView
          list={currentList}
          tasks={visibleTasks}
          onBack={() => closeListDetail()}
          onAdd={() => openCreate({ listId: currentList.id })}
          onMoveSort={handleMoveSort}
          {...taskActions}
        />
      )}
      {view === 'settings' && (
        <SettingsView
          tasks={visibleTasks}
          lists={lists}
          onExport={() => downloadBackup(visibleTasks, lists)}
          onImport={handleImport}
          onMoveSort={handleMoveSort}
          appVersion={__APP_VERSION__}
          {...taskActions}
        />
      )}

      <button type="button" className="fab" onClick={() => openCreate(fabDefaults)}>
        <Plus size={22} aria-hidden="true" />
        <span>Aufgabe</span>
      </button>
      <BottomNavigation
        activeView={view}
        onChange={(nextView) => {
          if (selectedListId !== null) closeListDetail();
          setView(nextView);
          setSmartView(null);
        }}
      />
      {formOpen && (
        <TaskForm
          task={editingTask}
          lists={lists}
          defaultDate={formDefaults.date}
          defaultListId={formDefaults.listId}
          defaultFlagged={formDefaults.flagged}
          defaultPriority={formDefaults.priority}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      )}
      {listSheet && (
        <ListFormSheet
          mode={listSheet.mode}
          initialName={listSheet.list?.name ?? ''}
          initialIsChecklist={listSheet.list?.isChecklist ?? false}
          onSave={(draft) => (listSheet.mode === 'create' ? saveCreatedList(draft) : saveEditedList(listSheet.list, draft))}
          onCancel={() => setListSheet(null)}
        />
      )}
      {updateAvailable ? (
        <button type="button" className="toast update-toast" onClick={() => (applyUpdate ? applyUpdate() : window.location.reload())}>
          Neue Version verfuegbar. Neu laden.
        </button>
      ) : message && (
        <button type="button" className="toast" onClick={() => setMessage(null)}>
          {message}
        </button>
      )}
    </div>
  );
}
