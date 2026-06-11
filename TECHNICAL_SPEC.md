# TECHNICAL_SPEC.md

## Zielarchitektur

SoloTodo PWA ist eine mobile-first React/Vite/TypeScript-App. Sie laeuft vollstaendig im Browser, speichert lokal per Dexie in IndexedDB und nutzt `vite-plugin-pwa` fuer App-Shell und Updates.

## Technische Grundsaetze

- Offline-first
- lokale Datenhaltung als einzige primaere Datenquelle
- kein Backend
- kein Login
- keine Cloud-Synchronisierung
- UI, Domain-Logik und Datenzugriff bleiben getrennt

## Hauptmodule

### UI Layer

- `src/app/App.tsx`: zentrale View-Steuerung und Handler
- `src/components/*`: Task-Formular, Task-Karten, Dashboard-Kacheln, Listenzeilen, Segmente
- `src/views/*`: Dashboard, Geplant, Listen, Listendetail, Smart-View-Detail, Kalender, Mehr

### Domain Layer

- `task-model.ts`: Task, Prioritaet, Status und Wiederholungsmodell
- `list-model.ts`: Listenmodell und Default-Liste
- `task-service.ts`: Erstellen, Aktualisieren, Sortieren, Statuswechsel
- `list-service.ts`: Erstellen, Umbenennen, Default-Liste sicherstellen
- `smart-view-service.ts`: berechnete Smart Views
- `recurrence-service.ts`: einfache Wiederholungsberechnung
- `week-utils.ts`: Montag-bis-Sonntag-Wochenlogik
- `task-validation.ts`: Draft- und Importvalidierung

### Data Layer

- `db.ts`: Dexie-Datenbank `solotodo-db` mit Schema-Version 2 und Stores `tasks` und `lists`
- `schema.ts`: Datenbankname, Version und Store-Definitionen
- `storage-errors.ts`: strukturierte Speicherfehler mit Fehlercodes und UI-Mapping
- `storage-diagnostics.ts`: lokale Diagnose ohne Ausgabe von Aufgabeninhalten
- `task-repository.ts`: CRUD fuer Aufgaben
- `list-repository.ts`: CRUD fuer Listen
- `backup-service.ts`: Backup-Schema v2 und atomarer Import fuer Tasks und Listen

## Datenfluss

```text
UI-Aktion
  -> Domain-Service validiert und verarbeitet
  -> Repository speichert ueber Dexie in IndexedDB
  -> App-State wird aktualisiert
  -> View rendert berechnete Listen oder Smart Views
```

## Lokale Persistenz

- Datenbank: `solotodo-db`
- Dexie Schema-Version: `2`
- Store `tasks` mit Indizes `dueDate`, `status`, `listId`
- Store `lists`
- Bestehende Daten aus der direkten IndexedDB-Implementierung werden durch denselben Datenbanknamen und dieselben Stores weiterverwendet.
- Keine Migration darf Stores oder Records automatisch loeschen.
- Ein unrettbarer lokaler Zustand fuehrt zu Diagnose und Nutzerhinweis, nicht zu stillem Reset.

## Speicherfehler

- Speicherfehler werden als `StorageError` mit Codes gemeldet, z. B. `DB_OPEN_FAILED`, `DB_BLOCKED`, `DB_STORE_MISSING`, `DB_READ_FAILED`, `DB_WRITE_FAILED`, `DB_DELETE_FAILED`, `DB_IMPORT_VALIDATION_FAILED`, `DB_IMPORT_TRANSACTION_FAILED`, `DB_QUOTA_EXCEEDED` und `ID_GENERATION_FAILED`.
- Technische Details werden per `console.error` protokolliert.
- Die UI zeigt nur verstaendliche deutsche Meldungen, keine rohen Browser- oder DOMException-Texte.
- IDs werden zentral ueber `createId()` erzeugt: `crypto.randomUUID()`, dann `crypto.getRandomValues()`, dann Zeitstempel/Random-Fallback.

## Import-/Export-Regeln

Export:
- erzeugt JSON mit `schemaVersion: 2`
- enthaelt `exportedAt`
- enthaelt `tasks`
- enthaelt `lists`

Import:
- akzeptiert nur Schema-Version 2
- prueft JSON, Tasks und Listen
- verlangt gueltige `listId`-Referenzen
- stellt `Allgemein` sicher
- ersetzt lokale Daten erst nach Bestaetigung
- ersetzt Tasks und Listen atomar in einer Dexie-Transaktion
- ungueltige Backups veraendern bestehende lokale Daten nicht

## Offline-Verhalten

- `vite-plugin-pwa` erzeugt den Service Worker und das PWA-Manifest.
- Die App-Shell wird precached und veraltete Caches werden bereinigt.
- Neue Versionen werden per sichtbarem Neuladen-Hinweis aktiviert.
- CRUD fuer Aufgaben und Listen nutzt nur Dexie/IndexedDB.
- Backup-Export funktioniert lokal.
- PWA-Updates loeschen keine IndexedDB-Daten.
- In `Mehr` ist die App-Version sichtbar und eine Speicherdiagnose ausfuehrbar.

## Technische Nicht-Ziele

- keine API
- kein Server
- keine Authentifizierung
- keine Cloud-Datenbank
- kein Kalender-Sync
- keine nativen Apps
