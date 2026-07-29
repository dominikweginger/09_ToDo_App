import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultList } from '../domain/list-model';
import { App } from './App';
import { getAllLists } from '../data/list-repository';
import { getAllTasks } from '../data/task-repository';

vi.mock('../data/list-repository', () => ({
  deleteList: vi.fn(),
  getAllLists: vi.fn(),
  replaceLists: vi.fn(),
  saveList: vi.fn()
}));

vi.mock('../data/task-repository', () => ({
  deleteTask: vi.fn(),
  deleteTasksByListId: vi.fn(),
  getAllTasks: vi.fn(),
  replaceTasks: vi.fn(),
  saveTask: vi.fn()
}));

const defaultList = createDefaultList('2026-07-29T08:00:00.000Z');

async function openDefaultList() {
  fireEvent.click(screen.getByRole('button', { name: 'Listen' }));
  await screen.findByRole('heading', { name: 'Listen' });
  fireEvent.click(screen.getByRole('button', { name: /Allgemein/ }));
  await screen.findByRole('heading', { name: 'Allgemein' });
}

describe('App Listendetail-Navigation', () => {
  beforeEach(() => {
    vi.mocked(getAllTasks).mockResolvedValue([]);
    vi.mocked(getAllLists).mockResolvedValue([defaultList]);
    window.history.replaceState({ existingField: 'preserved' }, '', window.location.href);
    vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('kehrt ueber den sichtbaren Zurueck-Button zur Listenuebersicht zurueck', async () => {
    render(<App />);
    await openDefaultList();

    fireEvent.click(screen.getByRole('button', { name: 'Zurueck zu Listen' }));

    expect(screen.getByRole('heading', { name: 'Listen' })).toBeVisible();
    expect(window.history.back).toHaveBeenCalledTimes(1);
  });

  it('kehrt durch erneutes Tippen auf Listen zur Listenuebersicht zurueck', async () => {
    render(<App />);
    await openDefaultList();

    fireEvent.click(screen.getByRole('button', { name: 'Listen' }));

    expect(screen.getByRole('heading', { name: 'Listen' })).toBeVisible();
    expect(window.history.back).toHaveBeenCalledTimes(1);
  });

  it('schliesst das Listendetail bei popstate', async () => {
    render(<App />);
    await openDefaultList();

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: { existingField: 'preserved' } }));
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Listen' })).toBeVisible());
    expect(window.history.back).not.toHaveBeenCalled();
  });

  it('erzeugt bei Re-Renders keinen zusaetzlichen Detail-History-Eintrag', async () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const { rerender } = render(<App />);
    await openDefaultList();

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith(
      {
        existingField: 'preserved',
        solotodoSubView: 'list-detail',
        listId: defaultList.id
      },
      ''
    );

    rerender(<App />);

    expect(pushState).toHaveBeenCalledTimes(1);
  });

  it('laesst beim Wechsel in einen anderen Hauptbereich keinen reaktivierbaren Detailzustand zurueck', async () => {
    render(<App />);
    await openDefaultList();

    fireEvent.click(screen.getByRole('button', { name: 'Dashboard' }));

    expect(screen.getByRole('heading', { name: 'SoloTodo' })).toBeVisible();
    expect(window.history.back).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: { existingField: 'preserved' } }));
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: 'SoloTodo' })).toBeVisible());
    expect(screen.queryByRole('heading', { name: 'Allgemein' })).not.toBeInTheDocument();
  });
});
