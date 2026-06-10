# TECHNICAL_SPEC.md

## Zielarchitektur

SoloTodo PWA ist eine mobile-first React/Vite/TypeScript-App. Sie laeuft vollstaendig im Browser, speichert lokal in IndexedDB und nutzt einen Service Worker fuer die App-Shell.

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

- `db.ts`: IndexedDB Version 2 mit Stores `tasks` und `lists`
- `task-repository.ts`: CRUD fuer Aufgaben
- `list-repository.ts`: CRUD fuer Listen
- `backup-service.ts`: Backup-Schema v2 fuer Tasks und Listen

## Datenfluss

```text
UI-Aktion
  -> Domain-Service validiert und verarbeitet
  -> Repository speichert in IndexedDB
  -> App-State wird aktualisiert
  -> View rendert berechnete Listen oder Smart Views
```

## IndexedDB

- Datenbank: `solotodo-db`
- Version: `2`
- Store `tasks` mit Indizes `dueDate`, `status`, `listId`
- Store `lists`

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

## Offline-Verhalten

- App-Shell wird im Service Worker Cache `solotodo-shell-v2` gespeichert.
- CRUD fuer Aufgaben und Listen nutzt nur IndexedDB.
- Backup-Export funktioniert lokal.

## Technische Nicht-Ziele

- keine API
- kein Server
- keine Authentifizierung
- keine Cloud-Datenbank
- kein Kalender-Sync
- keine nativen Apps
