# TECHNICAL_SPEC.md

## Zielarchitektur

SoloTodo PWA wird als mobile-first Progressive Web App umgesetzt. Die Anwendung läuft im Browser, kann auf dem Smartphone installiert bzw. zum Startbildschirm hinzugefügt werden und speichert alle Daten lokal.

## Technische Grundsätze

- Offline-first
- lokale Datenhaltung als einzige primäre Datenquelle
- kein Backend
- kein Login
- keine Cloud-Synchronisierung
- klare Trennung von UI, Datenzugriff und Geschäftslogik
- MVP zuerst, Erweiterungen später

## Tech-Stack

Offene Entscheidung: finaler Frontend-Stack.

Zulässige Optionen laut Blueprint:
- Vanilla JavaScript
- React
- Vue
- Svelte

Pragmatische Empfehlung:
- React + Vite + TypeScript, falls strukturierter Ausbau gewünscht ist
- Vanilla JavaScript, falls maximale Einfachheit wichtiger ist

Codex darf den Stack nicht ohne ausdrückliche Entscheidung unnötig verkomplizieren.

## Hauptmodule

### UI Layer

Verantwortlich für:
- Navigation
- Ansichten
- Task-Formular
- Kalenderdarstellung
- Statusanzeigen
- Fehler- und Bestätigungsdialoge

Vorgesehene Ansichten:
- Heute
- Kalender
- Inbox
- Mehr/Einstellungen
- Task-Detail oder Task-Formular

### Domain Layer

Verantwortlich für:
- Task-Validierung
- Statuswechsel
- Fälligkeitslogik
- Überfälligkeitslogik
- Sortierung und Filterung
- Import-/Export-Regeln

### Data Layer

Verantwortlich für:
- lokale Speicherung
- Laden und Speichern von Aufgaben
- Backup-Export
- Backup-Import
- Datenmigrationen bei Schemaänderungen

Empfohlene Speicherung:
- IndexedDB
- optional Dexie.js als Wrapper

Offene Entscheidung:
- IndexedDB direkt oder Dexie.js.

### PWA Layer

Verantwortlich für:
- Web App Manifest
- Service Worker
- App-Shell-Caching
- Offline-Startfähigkeit
- Grundverhalten bei fehlender Verbindung

## Datenfluss

```text
UI-Aktion
  -> Domain-Service validiert und verarbeitet
  -> Repository speichert in IndexedDB
  -> UI-State wird aktualisiert
  -> Ansicht zeigt neue Daten
```

Beispiele:
- Aufgabe erstellen
- Aufgabe erledigen
- Aufgabe verschieben
- Backup importieren

## Offline-Verhalten

Die App muss nach dem ersten erfolgreichen Laden ohne Internet verwendbar sein.

Mindestanforderungen:
- App-Shell wird gecacht.
- lokale Datenbank bleibt nutzbar.
- CRUD-Operationen funktionieren offline.
- keine Funktion im MVP darf zwingend Netzwerkzugriff verlangen.

Bekannte Einschränkung:
- Wenn die App noch nie geladen wurde, kann sie offline nicht erstmalig gestartet werden.

## Datenvalidierung

Eine Aufgabe darf nur gespeichert werden, wenn:

- `title` nach Trim nicht leer ist
- `dueDate` leer oder gültiges Datum im Format `YYYY-MM-DD` ist
- `dueTime` leer oder gültige Uhrzeit im Format `HH:mm` ist
- `priority` einem erlaubten Wert entspricht
- `status` einem erlaubten Wert entspricht

## Import-/Export-Regeln

Export:
- erzeugt JSON-Datei
- enthält `schemaVersion`
- enthält `exportedAt`
- enthält alle Tasks
- enthält optional Categories

Import:
- prüft JSON-Struktur
- prüft Schema-Version
- zeigt Warnung vor potenzieller Überschreibung
- darf bestehende Daten nicht stillschweigend zerstören

Offene Entscheidung:
- Import ersetzt vorhandene Daten oder führt Daten zusammen.

## Fehlerbehandlung

Fehler müssen sichtbar und verständlich behandelt werden:

- ungültige Eingabe
- lokale Datenbank nicht verfügbar
- Importdatei ungültig
- Speicherfehler
- Offline-Start nicht möglich
- Export fehlgeschlagen

## Sicherheit und Datenschutz

- Daten bleiben lokal im Browserkontext.
- Kein Tracking.
- Keine externen Analyse-Tools.
- Keine Serverkommunikation für Aufgaben.
- Eine PIN-Sperre ist optional und nicht Bestandteil des MVP.

## Technische Nicht-Ziele

- kein Backend
- keine Authentifizierung
- keine API
- keine Cloud-Datenbank
- kein serverseitiger Sync
- keine native Android- oder iOS-App im MVP
