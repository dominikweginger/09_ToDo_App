# TECHNICAL_SPEC.md

Status: **aktuelle kanonische technische Spezifikation nach CR_006** (29.07.2026). Historische Execution Specs dokumentieren die jeweilige Umsetzung, sind aber nicht mehr auszufuehren.

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

- `src/app/App.tsx`: zentrale View-Steuerung, Handler und leichter History-Zustand fuer Listendetails
- `src/components/*`: Task-Formular, Task-Karten, Dashboard-Kacheln, Listenzeilen, Segmente
- `src/views/*`: Dashboard, Geplant, Listen, Listendetail, Smart-View-Detail, Kalender, Mehr

### Domain Layer

- `task-model.ts`: Task, Prioritaet, Status und Wiederholungsmodell
- `list-model.ts`: Listenmodell mit `isChecklist`, `ListDraft` und Default-Liste
- `task-service.ts`: Erstellen, Aktualisieren, Sortieren, Statuswechsel
- `list-service.ts`: Erstellen, Bearbeiten, Normalisieren und Default-Liste sicherstellen
- `task-visibility-service.ts`: zentrale, listenbasierte Sichtbarkeit ausserhalb der eigenen Liste
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
- `isChecklist` ist ein nicht indexiertes Feld im bestehenden Listenrecord; DB-Version, Stores und Indizes bleiben unveraendert.
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
- enthaelt den von `App.tsx` uebergebenen nicht archivierten Task-Bestand vollstaendig, einschliesslich undatierter Checklistenaufgaben
- archivierte Task-Records werden vom aktuellen UI-Exporthandler nicht uebergeben

Import:
- akzeptiert nur Schema-Version 2
- prueft JSON, Tasks und Listen
- verlangt gueltige `listId`-Referenzen
- stellt `Allgemein` sicher
- normalisiert `isChecklist` nur bei echtem `true`; `Allgemein` wird immer auf `false` gesetzt
- ersetzt lokale Daten erst nach Bestaetigung
- ersetzt Tasks und Listen atomar in einer Dexie-Transaktion
- ungueltige Backups veraendern bestehende lokale Daten nicht

## Checklisten-Sichtbarkeit

- `getTasksVisibleOutsideOwnList(tasks, lists)` ist die einzige globale Sichtbarkeitsregel.
- Nur undatierte Tasks aus Listen mit `isChecklist === true` werden global ausgeblendet.
- Datierte Tasks, normale Listen und unbekannte `listId`-Werte bleiben global zulaessig.
- Smart Views und `Alle Aufgaben` verwenden den gefilterten Bestand; Listendetails, Listenzaehler und Backup verwenden den vollstaendigen Bestand.
- Eine Aenderung des Listentyps schreibt oder migriert keine Tasks.

### Verbraucher der zentralen Regel

- `DashboardView`: filtert nur den Task-Bestand fuer Smart-View-Zahlen; Listenwerte werden aus allen offenen Tasks berechnet.
- `SmartViewDetailView`: filtert vor der bestehenden Smart-View-Berechnung.
- `SettingsView`: filtert innerhalb seiner Props nur die Darstellung `Alle Aufgaben`; Backup-Anzahl und Exportcallback verwenden alle uebergebenen Tasks. `App.tsx` uebergibt dabei bereits den nicht archivierten Bestand.
- `ListDetailView` und `ListsView`: verwenden bewusst keinen globalen Filter.
- `PlannedView` und `CalendarView`: benoetigen keine Sonderlogik, weil ihre relevanten Tasks datiert sind.

## Datumsauswahl im Aufgabenformular

- `TaskForm` verwendet fuer Schnellaktionen und den nativen Picker-Ausloeser ausschliesslich `draft.dueDate`.
- Der aktive Datumstyp wird ohne eigenen React-State in der Reihenfolge leer, heute, morgen, naechster Montag, benutzerdefiniert aus `draft.dueDate` abgeleitet.
- Jeder Datumsbutton besitzt `aria-pressed`; genau ein Button ist aktiv und zeigt zusaetzlich ein fuer assistive Technologien verborgenes Check-Icon.
- Bei einem benutzerdefinierten Datum zeigt der bestehende Picker-Button `formatDateLabel(draft.dueDate)` und bleibt zum erneuten Oeffnen des Pickers bedienbar.
- Der stets vorhandene native Picker-Ausloeser ist visuell verborgen und nicht per Tab erreichbar. `showPicker()` wird bevorzugt; `focus()` und `click()` bilden den fehlergeschuetzten Fallback.
- Unter `Details anzeigen` existiert kein zweites sichtbares Datumsfeld; Uhrzeit und alle anderen Detailfunktionen bleiben erhalten.
- Die formularbezogene Schnellaktion `Diese Woche` existiert nicht mehr. Smart-View- und Wochenlogik in Domain und Views bleiben unveraendert.
- Es gibt keinen zweiten Datums-State, keine neue Abhaengigkeit und keine Aenderung an Modell, Persistenz oder Services.

## Ruecknavigation aus Listendetails

- `App.tsx` haelt weiterhin die View-Steuerung ohne Routing-Bibliothek und ohne sichtbare URL-Aenderung.
- `openList(listId)` legt nur beim Wechsel von der Listenuebersicht in ein Detail einen History-Eintrag mit `solotodoSubView: 'list-detail'` und `listId` an. Vorhandene Felder aus `window.history.state` bleiben erhalten.
- Re-Renders und ein erneuter Aufruf fuer ein bereits geoeffnetes Detail erzeugen keinen weiteren Eintrag.
- `closeListDetail()` ist die zentrale UI-seitige Rueckkehrlogik. Zurueck-Button, erneutes Tippen auf `Listen` und der Wechsel in einen anderen Hauptbereich schliessen den React-Detailzustand und verlassen einen aktiven Detail-History-Eintrag ueber `history.back()`.
- Ein registrierter `popstate`-Listener schliesst ein geoeffnetes Detail nach Browser- beziehungsweise Android-Zurueck und wird beim Unmount entfernt.
- Die Navigation schreibt keine Task- oder Listenrecords und aendert weder Dexie-Schema-Version 2 noch Backup-Schema v2.

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

## Projektstruktur und Befehle

- `src/app/`: App-State, Navigation und Handler
- `src/components/`: wiederverwendbare UI-Komponenten und Sheets
- `src/views/`: Haupt-, Listen- und Smart-View-Ansichten
- `src/domain/`: Modelle und reine Fachlogik
- `src/data/`: Dexie, Repositories, Backup und Diagnose
- `src/tests/`: Test-Setup; fachnahe Tests liegen neben den Modulen

```bash
npm run dev
npm test
npm run build
npm run preview
```

Es existieren keine konfigurierten Lint-, E2E- oder Datenbankmigrationsbefehle. Manuelle Mobile-/Offline-Smokes sind im `TEST_PLAN.md` beschrieben.
