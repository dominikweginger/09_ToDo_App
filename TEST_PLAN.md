# TEST_PLAN.md

## Ziel

Der Testplan stellt sicher, dass SoloTodo PWA als MVP stabil, offlinefähig und alltagstauglich funktioniert.

## Teststrategie

Es werden drei Testebenen genutzt:

1. manuelle Smoke Tests
2. funktionale Tests der Kernlogik
3. gezielte Offline- und Import-/Export-Tests

Automatisierte Tests sind empfohlen, aber für den ersten MVP nicht wichtiger als sauber dokumentierte manuelle Abnahmetests.

## Smoke Tests

### Start und Navigation

- App startet ohne Fehler.
- Heute-Ansicht ist sichtbar.
- Navigation zu Kalender, Inbox und Mehr funktioniert.
- „+ Aufgabe“-Button ist sichtbar und bedienbar.

### Aufgabe erstellen

- Aufgabe mit Titel kann gespeichert werden.
- Aufgabe ohne Titel wird abgelehnt.
- Aufgabe mit Datum erscheint in der passenden Ansicht.
- Aufgabe ohne Datum erscheint in der Inbox.
- Aufgabe mit heutigem Datum erscheint in Heute.

### Aufgabe bearbeiten

- Titel kann geändert werden.
- Datum kann geändert werden.
- Uhrzeit kann gesetzt und entfernt werden.
- Priorität kann geändert werden.
- Notiz kann geändert werden.

### Aufgabe erledigen

- Aufgabe kann als erledigt markiert werden.
- Erledigte Aufgabe verschwindet aus offenen Listen oder wird als erledigt angezeigt.
- Erledigte Aufgabe kann wieder geöffnet werden.

### Aufgabe löschen

- Aufgabe kann gelöscht werden.
- Löschung wird bestätigt, falls Bestätigungsdialog umgesetzt ist.
- Gelöschte Aufgabe erscheint nach Reload nicht wieder.

## Kalender-Tests

- Kalender zeigt aktuelles Monat.
- Ein Datum kann ausgewählt werden.
- Tagesliste zeigt Aufgaben des gewählten Datums.
- Aufgabe kann auf ein anderes Datum verschoben werden.
- Aufgaben ohne Datum erscheinen nicht in der Tagesliste.

## Heute-Ansicht

- Heutige offene Aufgaben werden angezeigt.
- Überfällige offene Aufgaben werden erkennbar angezeigt.
- Erledigte Aufgaben werden nicht fälschlich als offen dargestellt.

## Inbox

- Aufgaben ohne Datum werden angezeigt.
- Aufgabe verschwindet aus Inbox, wenn ein Datum gesetzt wird.
- Aufgabe erscheint wieder in Inbox, wenn Datum entfernt wird.

## Persistenztests

- Aufgabe erstellen.
- Browser/App schließen.
- App erneut öffnen.
- Aufgabe ist weiterhin vorhanden.

Zusätzlich:
- Status bleibt erhalten.
- Datum bleibt erhalten.
- Notiz bleibt erhalten.
- Priorität bleibt erhalten.

## Offline-Tests

Voraussetzung:
- App wurde mindestens einmal online geladen.

Tests:
- Internetverbindung deaktivieren.
- App öffnen.
- Aufgabe erstellen.
- Aufgabe bearbeiten.
- Aufgabe erledigen.
- App schließen und erneut öffnen.
- Daten bleiben erhalten.

Fehlerfall:
- App erstmalig offline öffnen.
- Erwartung: verständliche Browser-/App-Reaktion, soweit technisch möglich.

## Import-/Export-Tests

### Export

- Export erzeugt JSON-Datei.
- JSON enthält `schemaVersion`.
- JSON enthält `exportedAt`.
- JSON enthält vorhandene Aufgaben.

### Import

- gültige JSON-Datei kann importiert werden.
- ungültige JSON-Datei wird abgelehnt.
- falsche Schema-Version wird erkannt.
- leere Datei wird abgefangen.
- Nutzer wird vor Datenüberschreibung gewarnt, falls Import ersetzt.

## Akzeptanzkriterien

Der MVP ist bestanden, wenn:

- alle Muss-Funktionen aus PRD.md funktionieren.
- keine Cloud-, Login- oder Backend-Abhängigkeit existiert.
- lokale Speicherung zuverlässig funktioniert.
- Offline-Nutzung nach erstem Laden möglich ist.
- JSON-Backup funktioniert.
- relevante Fehlerfälle verständlich behandelt werden.
- README den Projektstart korrekt beschreibt.
