# docs/PROMPTS.md

## Zweck

Dieses Dokument enthält direkt nutzbare Prompts für Codex, um das Projekt strukturiert umzusetzen, zu prüfen und zu erweitern.

## Prompt 1: Projekt prüfen

```text
Prüfe die vorhandenen Projektdokumente für SoloTodo PWA auf Konsistenz.

Berücksichtige:
- MASTER_BLUEPRINT.md
- README.md
- PRD.md
- TECHNICAL_SPEC.md
- IMPLEMENTATION_PLAN.md
- TEST_PLAN.md
- AGENTS.md
- docs/UI_SPEC.md
- docs/DATA_MODEL.md
- docs/DECISIONS.md

Aufgaben:
1. Prüfe auf Widersprüche.
2. Prüfe, ob alle Muss-Funktionen aus PRD.md im IMPLEMENTATION_PLAN.md abgedeckt sind.
3. Prüfe, ob TECHNICAL_SPEC.md keine Nicht-Ziele verletzt.
4. Prüfe, ob TEST_PLAN.md alle Muss-Funktionen testet.
5. Ändere keinen Code.
6. Gib eine strukturierte Liste mit Findings, Risiken und empfohlenen Dokumentänderungen aus.
```

## Prompt 2: Projekt initialisieren

```text
Initialisiere das Coding-Projekt für SoloTodo PWA auf Basis der vorhandenen Projektdokumente.

Ziele:
- Erstelle die technische Grundstruktur.
- Implementiere noch keine erweiterten Features.
- Halte dich strikt an MVP, Nicht-Ziele und AGENTS.md.

Wichtig:
- Kein Backend.
- Kein Login.
- Keine Cloud-Synchronisierung.
- Mobile-first.
- Lokale Speicherung vorbereiten.
- Offline-Fähigkeit vorbereiten.

Ergebnis:
- Projekt kann lokal gestartet werden.
- Grundlayout mit Platzhalteransichten existiert.
- README wird mit echtem Setup aktualisiert.
```

## Prompt 3: MVP Phase 1 umsetzen

```text
Setze Phase 1 aus IMPLEMENTATION_PLAN.md um.

Umfang:
- mobile-first App Shell
- Bottom Navigation
- Ansichten: Heute, Kalender, Inbox, Mehr
- globaler Button „+ Aufgabe“
- einfache Platzhalterinhalte

Nicht umsetzen:
- kein Backend
- keine Cloud
- kein Login
- noch keine komplexen Features

Nach Umsetzung:
- Smoke Test dokumentieren.
- README aktualisieren, falls Startbefehl oder Struktur geändert wurde.
```

## Prompt 4: Task-Datenmodell und lokale Speicherung

```text
Setze das Task-Datenmodell und die lokale Speicherung gemäß TECHNICAL_SPEC.md und docs/DATA_MODEL.md um.

Umfang:
- Task-Modell
- Validierung
- lokales Repository
- Laden, Speichern, Aktualisieren, Löschen
- Persistenz nach Reload

Beachte:
- lokale Speicherung ist zentrale Datenquelle.
- Keine Server- oder API-Anbindung.
- Fehler verständlich behandeln.

Nach Umsetzung:
- Tests oder Smoke Tests für Persistenz durchführen.
```

## Prompt 5: Aufgaben-CRUD umsetzen

```text
Setze vollständige Aufgabenverwaltung für den MVP um.

Umfang:
- Aufgabe erstellen
- Aufgabe bearbeiten
- Aufgabe löschen
- Aufgabe erledigen
- erledigte Aufgabe wieder öffnen
- Pflichtfeldprüfung Titel
- Datum, Uhrzeit, Notiz und Priorität unterstützen

Nach Umsetzung:
- manuelle Smoke Tests aus TEST_PLAN.md durchführen.
```

## Prompt 6: Ansichtenlogik umsetzen

```text
Setze die Ansichtenlogik um.

Umfang:
- Heute zeigt heutige und überfällige offene Aufgaben.
- Inbox zeigt Aufgaben ohne Datum.
- Kalender zeigt Tagesliste für ausgewähltes Datum.
- Aufgaben erscheinen an der richtigen Stelle abhängig von dueDate und status.

Nicht umsetzen:
- keine externen Kalenderintegrationen
- keine Synchronisierung
```

## Prompt 7: Backup Import/Export umsetzen

```text
Setze JSON-Export und JSON-Import gemäß docs/DATA_MODEL.md um.

Umfang:
- Export mit schemaVersion, exportedAt, tasks und categories
- Import mit Validierung
- Fehlerbehandlung für ungültige Dateien
- Schutz vor unbeabsichtigtem Datenverlust

Offene Entscheidung beachten:
- Falls Importlogik noch nicht entschieden ist, schlage eine sichere Standardlösung vor und dokumentiere sie in docs/DECISIONS.md, bevor du implementierst.
```

## Prompt 8: PWA und Offline-Fähigkeit umsetzen

```text
Setze PWA-Funktionalität und Offline-Fähigkeit um.

Umfang:
- Web App Manifest
- Service Worker
- App-Shell-Caching
- Offline-Test nach erstem Laden

Nicht umsetzen:
- keine Push Notifications
- keine Cloud-Funktionen
- keine Serverkomponenten

Nach Umsetzung:
- Offline-Smoke-Test aus TEST_PLAN.md dokumentieren.
```

## Prompt 9: MVP-Abnahme

```text
Prüfe den MVP gegen PRD.md, TEST_PLAN.md und Definition of Done.

Aufgaben:
1. Liste erfüllte Muss-Funktionen.
2. Liste nicht erfüllte Muss-Funktionen.
3. Prüfe Nicht-Ziele.
4. Prüfe Offline-Fähigkeit.
5. Prüfe lokale Speicherung.
6. Prüfe Import/Export.
7. Gib eine klare Go/No-Go-Empfehlung für den MVP.
```
