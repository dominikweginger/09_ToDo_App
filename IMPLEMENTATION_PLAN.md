# IMPLEMENTATION_PLAN.md

## Ziel

Dieses Dokument beschreibt die empfohlene Umsetzungsreihenfolge für den MVP von SoloTodo PWA. Die Umsetzung soll schrittweise erfolgen, damit Codex die App stabil und prüfbar aufbauen kann.

## Phase 0: Projektentscheidung und Setup

Ziele:
- Tech-Stack final festlegen
- Projektstruktur anlegen
- Entwicklungsumgebung startfähig machen

Aufgaben:
- Entscheidung zu Framework dokumentieren
- Entscheidung zu IndexedDB direkt oder Dexie.js dokumentieren
- Basisprojekt erstellen
- Linting/Formatierung optional einrichten
- Ordnerstruktur anlegen

Ergebnis:
- App startet lokal mit leerer Startseite.

## Phase 1: Grundlayout und Navigation

Ziele:
- mobile-first Grundlayout
- Bottom Navigation
- Platzhalteransichten

Umzusetzen:
- Heute
- Kalender
- Inbox
- Mehr/Einstellungen
- globaler „+ Aufgabe“-Button

Ergebnis:
- Nutzer kann zwischen den Hauptansichten wechseln.

## Phase 2: Datenmodell und lokale Speicherung

Ziele:
- Task-Modell implementieren
- lokale Persistenz herstellen

Umzusetzen:
- Task-Typ/Interface
- Validierungslogik
- Repository/Data-Service
- IndexedDB-Anbindung
- Laden/Speichern/Löschen von Tasks

Ergebnis:
- Aufgaben bleiben nach Reload erhalten.

## Phase 3: Aufgaben-CRUD

Ziele:
- Aufgaben vollständig verwalten

Umzusetzen:
- Aufgabe erstellen
- Aufgabe bearbeiten
- Aufgabe löschen
- Aufgabe erledigen
- erledigte Aufgabe wieder öffnen
- Task-Formular oder Bottom Sheet
- Pflichtfeldprüfung für Titel

Ergebnis:
- Kernverwaltung funktioniert.

## Phase 4: Ansichtenlogik

Ziele:
- Aufgaben korrekt in Ansichten anzeigen

Umzusetzen:
- Heute-Ansicht mit heutigen Aufgaben
- Anzeige überfälliger Aufgaben
- Inbox für Aufgaben ohne Datum
- Kalenderansicht mit Tagesauswahl
- Tagesliste je Kalenderdatum
- einfache Gesamtübersicht oder Suche

Ergebnis:
- Aufgaben erscheinen abhängig von Datum und Status an der richtigen Stelle.

## Phase 5: Backup Import/Export

Ziele:
- lokale Datensicherung ermöglichen

Umzusetzen:
- JSON-Export
- JSON-Import
- Schema-Version prüfen
- Fehlerfälle behandeln
- Warnung vor Überschreiben oder Importkonflikten

Offene Entscheidung:
- Ersetzen oder Zusammenführen bestehender Daten.

Ergebnis:
- Nutzer kann Daten sichern und wiederherstellen.

## Phase 6: PWA und Offline-Fähigkeit

Ziele:
- App installierbar und offlinefähig machen

Umzusetzen:
- Web App Manifest
- Service Worker
- App-Shell-Caching
- Offline-Test
- Basis-Icon/Splash optional

Ergebnis:
- App funktioniert nach erstem Laden offline.

## Phase 7: Tests und Stabilisierung

Ziele:
- MVP fachlich und technisch absichern

Umzusetzen:
- Smoke Tests
- Validierungstests
- Import-/Export-Tests
- Offline-Test
- manuelle Smartphone-Prüfung
- README aktualisieren

Ergebnis:
- MVP erfüllt Definition of Done.

## Spätere Erweiterungsphasen

Nicht vor MVP umsetzen:
- Kategorien/Listen
- Wiederkehrende Aufgaben
- Dark Mode
- lokale Erinnerungen
- Statistiken
- PIN-Sperre
- CSV-Import/Export
- KI-Planung

## Empfohlene Dateistruktur nach Implementierung

```text
src/
├── app/
│   └── app-shell
├── components/
│   ├── bottom-navigation
│   ├── task-card
│   ├── task-form
│   └── dialogs
├── views/
│   ├── today
│   ├── calendar
│   ├── inbox
│   └── settings
├── domain/
│   ├── task-model
│   ├── task-service
│   └── task-validation
├── data/
│   ├── task-repository
│   ├── db
│   └── backup-service
├── pwa/
│   ├── manifest
│   └── service-worker
└── tests/
```

Hinweis: Exakte Dateiendungen hängen vom gewählten Tech-Stack ab.
