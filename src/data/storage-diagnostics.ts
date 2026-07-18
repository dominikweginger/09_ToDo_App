import { createId } from '../domain/id-service';
import { DB_NAME, DB_VERSION, LIST_STORE, TASK_STORE } from './schema';
import { db, openStorageDatabase } from './db';
import { logStorageError } from './storage-errors';

export interface StorageDiagnosticsReport {
  ok: boolean;
  text: string;
}

export async function runStorageDiagnostics(appVersion: string): Promise<StorageDiagnosticsReport> {
  const lines: string[] = [
    'SoloTodo Speicherdiagnose',
    `Zeitpunkt: ${new Date().toISOString()}`,
    `App-Version: ${appVersion}`,
    `Datenbank: ${DB_NAME}`,
    `Erwartete DB-Version: ${DB_VERSION}`
  ];
  let ok = true;

  const add = (label: string, value: string | number | boolean) => lines.push(`${label}: ${String(value)}`);
  const fail = (label: string, error: unknown) => {
    ok = false;
    add(label, 'FEHLER');
    lines.push(`Fehlerdetail: ${error instanceof Error ? `${error.name} (${error.message})` : String(error)}`);
    logStorageError(`diagnostics ${label}`, error);
  };

  add('IndexedDB verfuegbar', typeof globalThis.indexedDB !== 'undefined');
  add('crypto.randomUUID verfuegbar', typeof globalThis.crypto?.randomUUID === 'function');
  add('crypto.getRandomValues verfuegbar', typeof globalThis.crypto?.getRandomValues === 'function');

  try {
    add('createId() Test', Boolean(createId()));
  } catch (error) {
    fail('createId() Test', error);
  }

  try {
    await openStorageDatabase();
    add('DB oeffnbar', true);
    add('DB geoeffnet', db.isOpen());
    add('Aktuelle DB-Version', db.verno);

    const storeNames = db.tables.map((table) => table.name);
    add(`Store ${TASK_STORE} vorhanden`, storeNames.includes(TASK_STORE));
    add(`Store ${LIST_STORE} vorhanden`, storeNames.includes(LIST_STORE));
    add('Anzahl Aufgaben', await db.tasks.count());
    add('Anzahl Listen', await db.lists.count());

    const diagnosticId = `diagnostic-${createId()}`;
    await db.transaction('rw', db.lists, async () => {
      await db.lists.put({
        id: diagnosticId,
        name: 'Diagnose',
        color: null,
        isChecklist: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await db.lists.delete(diagnosticId);
    });
    add('Test-Schreib-/Loeschvorgang', true);
  } catch (error) {
    fail('Datenbanktest', error);
  }

  add('Service Worker API verfuegbar', 'serviceWorker' in navigator);
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      add('Service Worker registriert', Boolean(registration));
      add('Service Worker Controller aktiv', Boolean(navigator.serviceWorker.controller));
      add('Service Worker wartet', Boolean(registration?.waiting));
      add('Service Worker installiert', Boolean(registration?.active));
    } catch (error) {
      fail('Service Worker Status', error);
    }
  }

  add('Cache API verfuegbar', 'caches' in globalThis);
  if ('caches' in globalThis) {
    try {
      const keys = await caches.keys();
      add('Cache-Anzahl', keys.length);
    } catch (error) {
      fail('Cache Status', error);
    }
  }

  lines.push(`Gesamtstatus: ${ok ? 'OK' : 'PRUEFEN'}`);
  return { ok, text: lines.join('\n') };
}
