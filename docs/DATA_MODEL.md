# docs/DATA_MODEL.md

## Ziel

Dieses Dokument beschreibt Datenmodell, lokale Speicherung und Import-/Export-Struktur für SoloTodo PWA.

## Datenquelle

Primäre Datenquelle:
- Nutzereingaben in der App

Sekundäre Datenquellen:
- JSON-Backup-Import
- später optional CSV-Import

Es gibt keine Serverdatenbank und keine externe Synchronisierung.

## Speicherort

Die Daten werden lokal im Browserkontext gespeichert.

Empfohlen:
- IndexedDB

Offene Entscheidung:
- IndexedDB direkt verwenden oder Dexie.js als Wrapper nutzen.

## Entität: Task

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "status": "open | done | archived",
  "dueDate": "YYYY-MM-DD | null",
  "dueTime": "HH:mm | null",
  "priority": "none | low | medium | high",
  "categoryId": "string | null",
  "tags": ["string"],
  "isRecurring": false,
  "recurrenceRule": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime",
  "completedAt": "ISO datetime | null"
}
```

## Pflichtfelder

- `id`
- `title`
- `status`
- `priority`
- `createdAt`
- `updatedAt`

## Statuswerte

```text
open
done
archived
```

## Prioritätswerte

```text
none
low
medium
high
```

## Datumslogik

- `dueDate = null`: Aufgabe erscheint in Inbox.
- `dueDate = heute`: Aufgabe erscheint in Heute.
- `dueDate < heute` und `status = open`: Aufgabe ist überfällig.
- `dueDate = ausgewähltes Kalenderdatum`: Aufgabe erscheint in Tagesliste.

## Uhrzeitlogik

- `dueTime` ist optional.
- Eine Aufgabe mit Datum kann ohne Uhrzeit existieren.
- Uhrzeit dient im MVP nur zur Anzeige und Sortierung.
- Erinnerungen sind nicht Teil des MVP.

## Entität: Category

Kategorien sind Soll-Funktion, aber das Datenmodell kann vorbereitet werden.

```json
{
  "id": "string",
  "name": "string",
  "color": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

## Backup-Format

```json
{
  "schemaVersion": 1,
  "exportedAt": "ISO datetime",
  "tasks": [],
  "categories": []
}
```

## Export-Regeln

- Export enthält alle lokalen Aufgaben.
- Export enthält Schema-Version.
- Export enthält Exportzeitpunkt.
- Export erzeugt eine herunterladbare JSON-Datei.

## Import-Regeln

Import muss prüfen:

- Datei ist gültiges JSON.
- `schemaVersion` ist vorhanden.
- `tasks` ist vorhanden und Array.
- Task-Felder sind plausibel.
- ungültige Daten werden abgefangen.

Offene Entscheidung:
- Import ersetzt vorhandene Daten oder führt Daten zusammen.

## Datenmigration

Bei späteren Schemaänderungen muss eine Migration ergänzt werden.

MVP:
- `schemaVersion = 1`
