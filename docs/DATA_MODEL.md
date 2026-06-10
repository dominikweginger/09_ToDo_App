# docs/DATA_MODEL.md

## Ziel

Dieses Dokument beschreibt Datenmodell, lokale Speicherung und Backup-Schema fuer SoloTodo V2.

## Datenquelle

Primaere Datenquelle:
- Nutzereingaben in der App

Sekundaere Datenquelle:
- JSON-Backup-Import

Es gibt keine Serverdatenbank, kein Backend und keine externe Synchronisierung.

## Speicherort

Die Daten werden lokal im Browserkontext in IndexedDB gespeichert.

## IndexedDB

- Datenbank: `solotodo-db`
- Version: `2`
- Store `tasks`
- Store `lists`

## Entity: TodoList

```json
{
  "id": "string",
  "name": "string",
  "color": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Default:
- `id = "default-list"`
- `name = "Allgemein"`
- wird automatisch sichergestellt
- kann nicht geloescht werden

## Entity: Task

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "status": "open | done | archived",
  "listId": "string",
  "dueDate": "YYYY-MM-DD | null",
  "dueTime": "HH:mm | null",
  "priority": "none | low | medium | high",
  "isFlagged": "boolean",
  "recurrence": "TaskRecurrence | null",
  "sortOrder": "number",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime",
  "completedAt": "ISO datetime | null"
}
```

## Entity: TaskRecurrence

```json
{
  "enabled": true,
  "frequency": "daily | weekly | monthly | yearly",
  "interval": 1,
  "endDate": "YYYY-MM-DD | null",
  "advanceMode": "scheduledDate"
}
```

## Regeln

- Jede Aufgabe hat genau eine `listId`.
- Aufgaben ohne explizite Liste fallen auf `Allgemein`.
- Smart Views besitzen keine Aufgaben.
- `priority: high` bedeutet Dringend.
- `isFlagged: true` bedeutet Markiert.
- Wiederholungen erzeugen keine neue Aufgabe.
- Beim Abhaken einer wiederkehrenden Aufgabe wird `dueDate` auf das naechste Datum gesetzt und `status` bleibt `open`.

## Backup-Format v2

```json
{
  "schemaVersion": 2,
  "exportedAt": "ISO datetime",
  "tasks": [],
  "lists": []
}
```

## Export-Regeln

- Export enthaelt alle lokalen Aufgaben und Listen.
- Export enthaelt Schema-Version 2.
- Export enthaelt Exportzeitpunkt.
- Export erzeugt eine herunterladbare JSON-Datei.

## Import-Regeln

- Datei muss gueltiges JSON sein.
- `schemaVersion` muss `2` sein.
- `tasks` und `lists` muessen Arrays sein.
- Jede Aufgabe muss eine gueltige `listId` haben.
- `Allgemein` wird sichergestellt.
- Import ersetzt lokale Daten erst nach Bestaetigung.
