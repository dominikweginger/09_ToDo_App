# CR_003 – Codex Execution Spec

> **Historische Ausfuehrungsunterlage – abgeschlossen am 18.07.2026.** Nicht erneut als aktuelle Spezifikation ausfuehren. Ergebnis und Abweichungen sind in [`../../docs/CHANGELOG.md`](../../docs/CHANGELOG.md) dokumentiert.

## 1. Zweck

Dieses Dokument ist die eindeutige technische Ausführungsspezifikation für `CR_003`. Es enthält eine festgelegte Umsetzung ohne alternative Architekturvarianten.

Codex soll die vorhandene Architektur erweitern, nicht ersetzen. Der aktuelle Code ist für Dateinamen und bestehende Signaturen maßgeblich; `CR_003_CHANGE_REQUEST.md` bleibt für das gewünschte Verhalten maßgeblich.

## 2. Erwarteter Repo-Stand

- Repository: `dominikweginger/09_ToDo_App`
- Erwarteter Base Commit: `e6549b7b7ed7b912fb987bb805d208caf1c53ded`
- Default Branch: `master`
- Stack: React, Vite, TypeScript, Dexie/IndexedDB, Vitest, Testing Library

Wenn HEAD abweicht:

1. betroffene Dateien und Signaturen gegen den aktuellen Stand prüfen,
2. diese Spezifikation sinngemäß auf den aktuellen Code anwenden,
3. relevante Abweichungen im Abschlussbericht nennen,
4. nicht allein wegen einer Abweichung stoppen oder unnötig um Rückfrage bitten.

## 3. Verbindliche Architekturentscheidungen

### 3.1 Listenmodell

`TodoList` erhält das Pflichtfeld `isChecklist: boolean`.

Ein gemeinsamer `ListDraft` wird eingeführt und enthält ausschließlich:

- `name`
- `isChecklist`

`Task` und `TaskDraft` bleiben unverändert.

### 3.2 Listenservice

Der Listenservice verwendet verbindlich:

- `createList(draft)` zum Erstellen
- `updateList(list, draft)` zum Bearbeiten
- `normalizeList(list)` zur rückwärtskompatiblen Normalisierung
- `ensureDefaultList(lists)` zur Normalisierung aller Listen und Sicherstellung der Default-Liste

`renameList` wird durch `updateList` ersetzt. Alte Aufrufe werden vollständig angepasst; keine ungenutzte Kompatibilitätsfunktion zurücklassen.

Verhalten:

- Name wird wie bisher getrimmt und validiert.
- Nur echtes boolesches `true` ergibt `isChecklist: true`.
- ID, Farbe und `createdAt` bleiben beim Bearbeiten unverändert.
- `updatedAt` wird beim Bearbeiten aktualisiert.
- Die Default-Liste kann nicht bearbeitet werden.
- Jede Liste mit `DEFAULT_LIST_ID` wird bei Normalisierung zwingend zu `isChecklist: false`, auch wenn gespeicherte oder importierte Daten `true` enthalten.
- Normalisierung ersetzt keine gültigen IDs, Namen, Farben oder Zeitstempel.

### 3.3 Zentrale Sichtbarkeitslogik

Neue Datei: `src/domain/task-visibility-service.ts`.

Sie exportiert genau eine öffentliche Hauptfunktion:

`getTasksVisibleOutsideOwnList(tasks, lists)`

Vertrag der Funktion:

- erzeugt ein gefiltertes neues Task-Array,
- mutiert weder Tasks noch Listen,
- filtert ausschließlich anhand des Checklistenstatus der zugehörigen Liste und des Vorhandenseins von `dueDate`,
- blendet eine Aufgabe nur dann aus, wenn ihre Liste `isChecklist === true` besitzt und die Aufgabe kein Fälligkeitsdatum hat,
- behandelt jede datierte Aufgabe als global zulässig,
- behandelt normale Listen unverändert,
- behandelt unbekannte Listen-IDs fail-open als global zulässig,
- trifft keine Entscheidung über Status, Archivierung, Markierung, Priorität oder Sortierung,
- funktioniert für beliebig viele Checklisten.

Die Regel darf nicht mehrfach von Hand in Views nachgebaut werden.

## 4. UI und App-State

### 4.1 `src/components/ListFormSheet.tsx`

Der Formularmodus lautet verbindlich `create | edit`.

Props:

- `mode`
- `initialName`, standardmäßig leer
- `initialIsChecklist`, standardmäßig `false`
- `onSave`, erhält einen `ListDraft`
- `onCancel`

Das Formular besitzt:

- Listenname
- Checkbox `Checkliste`
- Hilfetext `Aufgaben ohne Datum aus dieser Liste werden nur in der Liste angezeigt.`

Beim Erstellen:

- Name leer
- Checkbox nicht aktiviert

Beim Bearbeiten:

- Name und Checklistenstatus korrekt vorausgefüllt

Die bestehende Namensvalidierung und Fehlerbehandlung bleiben erhalten. Die vorhandene CSS-Konvention `.check-row` und der vorhandene Stil `muted-line` werden wiederverwendet. `src/styles.css` nur ändern, falls der aktuelle Code dies tatsächlich erfordert.

### 4.2 `src/components/ListRow.tsx`

- Callback fachlich von Umbenennen zu Bearbeiten umbenennen.
- `aria-label`: `Liste bearbeiten`
- `title`: `Bearbeiten`
- Schutz der Default-Liste unverändert lassen.

### 4.3 `src/views/ListsView.tsx`

- Callback und Props auf Bearbeiten umbenennen.
- Listenzähler weiterhin aus allen offenen Aufgaben der jeweiligen Liste berechnen.
- Den globalen Sichtbarkeitsfilter hier nicht verwenden.

### 4.4 `src/app/App.tsx`

Der Listen-Sheet-State verwendet:

- Create-Modus ohne Liste
- Edit-Modus mit bestehender Nutzerliste

Handler und Speicherfunktionen werden fachlich auf Bearbeiten umbenannt.

Erstellen:

- `createList(draft)`
- über bestehendes Listen-Repository speichern
- Liste in den React-State aufnehmen

Bearbeiten:

- `updateList(list, draft)`
- über bestehendes Listen-Repository speichern
- Liste im React-State ersetzen

Dadurch müssen globale Ansichten und Zähler unmittelbar neu rendern. Beim Ändern des Listentyps dürfen keine Tasks geschrieben oder mutiert werden.

Beim initialen Laden und nach einem Import müssen die Listen über die zentrale Listennormalisierung laufen.

## 5. Anwendung der Sichtbarkeitsregel

### 5.1 `src/views/DashboardView.tsx`

Zwei Datenbasen verwenden:

- global zulässige Tasks für `getSmartViewCounts`
- ursprüngliche übergebene Tasks für offene Anzahlen unter `Meine Listen`

Der Checklistenfilter darf die Listenzähler nicht reduzieren.

### 5.2 `src/views/SmartViewDetailView.tsx`

Vor jeder Smart-View-Auswertung den global zulässigen Taskbestand bilden.

- Standard-Smart-Views erhalten den gefilterten Bestand.
- Die spezielle `Heute`-Darstellung verwendet ebenfalls den gefilterten Bestand für offene, überfällige und heutige Aufgaben.
- `smart-view-service.ts` bleibt listenblind und erhält keine Checklisten-Sonderlogik.

### 5.3 `src/views/SettingsView.tsx`

Nur der Block `Alle Aufgaben` verwendet den global zulässigen Taskbestand.

Nicht filtern:

- angezeigte Backup-Aufgabenanzahl
- Exportcallback
- Backup-Erstellung
- Diagnose

Der bisherige Exportumfang bleibt erhalten.

### 5.4 Unveränderte Fachlogik

`src/views/ListDetailView.tsx` verwendet den globalen Filter nicht.

`src/views/PlannedView.tsx` und `src/views/CalendarView.tsx` benötigen keine Checklisten-Sonderlogik, weil ihre relevanten Aufgaben bereits ein Datum besitzen. Produktionscode dort nur ändern, falls der aktuelle Repo-Stand dies technisch zwingend erfordert; dann im Abschlussbericht begründen.

## 6. Persistenz und Backup

### 6.1 Dexie

`src/data/schema.ts`, `DB_VERSION`, Stores und Indizes bleiben unverändert.

Es gibt:

- keine neue Datenbankversion,
- keinen neuen Store,
- keinen neuen Index,
- keine Migration, die Tasks oder Listen löscht.

Dexie speichert das zusätzliche, nicht indexierte Listenfeld im bestehenden Record.

### 6.2 Listen-Repository

Beim Lesen müssen Listen über `ensureDefaultList` normalisiert zurückgegeben werden.

Eine fehlende Default-Liste wird wie bisher gespeichert. Falls eine vorhandene Default-Liste einen ungültigen oder wahren Checklistenwert enthält, muss der normalisierte Zustand auch dauerhaft korrigierbar sein. Eine unnötige Schreibschleife bei jedem Laden vermeiden.

### 6.3 `src/data/backup-service.ts`

`BACKUP_SCHEMA_VERSION` bleibt `2`.

Die Listen-Normalisierung beim Import:

- validiert ID und Name wie bisher,
- übernimmt `isChecklist` nur bei echtem booleschem `true`,
- setzt alle anderen Werte auf `false`,
- erzwingt für `DEFAULT_LIST_ID` immer `false`,
- erhält gültige Farbe und Zeitstempel gemäß bisheriger Logik.

`createBackup` und `downloadBackup` erhalten keine Sichtbarkeitsfilterung. Der bisherige Exportumfang bleibt unverändert.

## 7. Repositoryweiter Änderungssweep

Vor dem Editieren repositoryweit suchen nach:

- `TodoList`-Objektliteralen und Listen-Fixtures
- `createDefaultList`
- `createList(`
- `renameList`
- `ensureDefaultList`
- `ListFormSheet`
- `mode="rename"` und dem Rename-Modus
- `onRenameList`
- Texten `Liste umbenennen` und `Umbenennen`

Alle durch das neue Pflichtfeld oder die Umbenennung betroffenen Call-Sites und Test-Fixtures anpassen.

Vorhandene Test-Fixtures in unter anderem `TaskForm.test.tsx`, `PlannedView.test.tsx` und `SmartViewDetailView.test.tsx` müssen `isChecklist` enthalten, ohne dass deren fachlicher Testzweck verändert wird.

## 8. Dateiumfang

### 8.1 Muss geändert oder neu angelegt werden

- `src/domain/list-model.ts`
- `src/domain/list-service.ts`
- `src/domain/task-visibility-service.ts` – neu
- `src/domain/task-visibility-service.test.ts` – neu
- `src/components/ListFormSheet.tsx`
- `src/components/ListFormSheet.test.tsx`
- `src/components/ListRow.tsx`
- `src/views/ListsView.tsx`
- `src/views/DashboardView.tsx`
- `src/views/SmartViewDetailView.tsx`
- `src/views/SettingsView.tsx`
- `src/app/App.tsx`
- `src/data/backup-service.ts`
- `src/data/backup-service.test.ts`
- vorhandene oder neue fokussierte View-Tests
- typbedingt betroffene Test-Fixtures und Call-Sites
- die unter Abschnitt 11 genannten Projektdokumente

### 8.2 Soll nicht fachlich geändert werden

- `src/domain/task-model.ts`
- Task-Services und Task-Repositorys
- `src/components/TaskForm.tsx`
- `src/components/TaskCard.tsx`
- `src/views/ListDetailView.tsx`
- `src/views/PlannedView.tsx`
- `src/views/CalendarView.tsx`
- `src/data/schema.ts`
- `src/data/db.ts`
- PWA- und Service-Worker-Konfiguration

Typ- oder Fixture-Anpassungen in zugehörigen Tests sind zulässig. Jede darüber hinausgehende Produktionsänderung in diesen Bereichen ist im Abschlussbericht zu begründen.

## 9. Implementierungsreihenfolge

1. Git-Status, HEAD und Baseline prüfen.
2. Repositoryweiten Änderungssweep durchführen.
3. Listenmodell, `ListDraft` und Normalisierung implementieren.
4. Listenservice und Default-Listenschutz anpassen.
5. zentralen Visibility-Service samt Unit-Tests implementieren.
6. Listenformular, ListRow, ListsView und App-State anpassen.
7. Dashboard, SmartViewDetail und `Alle Aufgaben` integrieren.
8. Backup-Import und Rückwärtskompatibilität anpassen.
9. typbedingt betroffene Fixtures und Tests korrigieren.
10. fokussierte View-, Form- und Backup-Tests ergänzen.
11. vollständige Tests und Build ausführen.
12. verfügbare Smoke Tests durchführen.
13. Dokumentation minimal und gezielt aktualisieren.
14. Akzeptanzkriterien einzeln gegenprüfen.

## 10. Qualitäts- und Testregeln

- Tests bevorzugt tabellengetrieben oder parametrisiert zusammenfassen.
- Nicht für jeden Eintrag der Testreferenz zwingend einen separaten Testfall erzeugen.
- Keine neue umfangreiche E2E-Infrastruktur nur für CR_003 einführen.
- Keine Snapshots als Ersatz für fachliche Assertions.
- Keine Duplikation der Visibility-Regel.
- Keine stillen Fallbacks, die Checklisten nach Namen erkennen.
- Keine Änderung des Task-Modells.
- Keine unaufgeforderten Refactorings.
- Bestehende Fehlermeldungs- und StorageError-Konventionen erhalten.

Baseline und Abschluss:

```bash
npm test
npm run build
```

Falls `node_modules` fehlt, vorher `npm install` ausführen. Falls die Baseline bereits fehlschlägt, Fehler dokumentieren, CR_003 dennoch bestmöglich umsetzen und klar zwischen vorbestehenden und neu verursachten Fehlern unterscheiden.

## 11. Dokumentation

Nach erfolgreicher Umsetzung minimal und zielgerichtet aktualisieren:

- `README.md`: aktueller Projektstatus und Checklistenfunktion
- `PRD.md`: Produktregel und Akzeptanzkriterien
- `TECHNICAL_SPEC.md`: Listenmetadatum und zentraler Visibility-Service
- `IMPLEMENTATION_PLAN.md`: CR_003 als umgesetzt, keine historische Komplettneuschreibung
- `TEST_PLAN.md`: neue Test- und Smoke-Abdeckung
- `docs/DATA_MODEL.md`: `isChecklist`, Default- und Normalisierungsregel, Backup v2
- `docs/UI_SPEC.md`: Liste bearbeiten, Checkbox und Hilfetext
- `docs/DECISIONS.md`: Entscheidung für boolesches Listenmetadatum und zentrale globale Sichtbarkeit

Bestehende Dokumente nicht unnötig vollständig umformulieren.

## 12. Abschlussbericht

Der Abschlussbericht enthält kompakt:

- umgesetzte Lösung
- zentrale Sichtbarkeitsregel
- geänderte und neue Dateien
- Baseline-Ergebnisse
- finale Test- und Build-Ergebnisse
- durchgeführte oder nicht mögliche Smoke Tests
- Bestätigung: keine Task-Migration und keine Task-Schreibvorgänge beim Listentypwechsel
- Bestätigung: DB-Version `2`
- Bestätigung: Backup-Schemaversion `2`
- Bestätigung: bisheriger Exportumfang und alle Checklistenaufgaben im Backup erhalten
- Abweichungen vom erwarteten Base Commit oder Dateiplan
- verbleibende Risiken; bei vollständiger Umsetzung ausdrücklich `keine`
