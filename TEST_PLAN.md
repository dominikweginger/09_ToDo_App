# TEST_PLAN.md

## Ziel

Der Testplan prueft SoloTodo V2 nach CR_001 auf lokale Datenintegritaet, Offline-Faehigkeit, Aufgabenlogik, Listen, Smart Views, Backup v2 und mobile Bedienbarkeit.

## Automatisierte Tests

Ausfuehren:

```bash
npm test
npm run build
```

Abgedeckt:
- Task-Erstellung mit Default-Liste
- Pflichtfeldvalidierung
- Statuswechsel
- wiederkehrende Aufgabe wird beim Abhaken weitergeschoben
- Ueberfaelligkeitslogik
- Sortierung nach Datum und Uhrzeit
- Backup-Schema v2
- Import von Tasks und Listen
- Ablehnung ungueltiger JSON-Dateien
- Ablehnung ungueltiger `listId`-Referenzen

## Smoke Tests

1. App starten.
2. Dashboard erscheint.
3. Bottom Navigation zeigt `Dashboard`, `Geplant`, `Listen`, `Mehr`.
4. Wechsel zwischen Hauptansichten funktioniert.
5. Floating Action Button oeffnet das Task-Formular.
6. Aufgabe mit Titel speichern.
7. Ohne explizite Liste landet die Aufgabe in `Allgemein`.
8. App zeigt keine Konsolenfehler beim Start und bei den Kerninteraktionen.

## Listen

- `Allgemein` existiert automatisch.
- Neue Liste erstellen.
- Liste umbenennen.
- Nicht leere Liste loeschen und Bestaetigung mit Aufgabenanzahl pruefen.
- `Allgemein` kann nicht geloescht werden.
- Aufgabe einer Liste zuordnen.
- Listendetail zeigt standardmaessig offene Aufgaben.
- Filter `Offen`, `Erledigt`, `Markiert` pruefen.

## Smart Views

- Heute zeigt heute und ueberfaellige offene Aufgaben.
- Geplant zeigt offene Aufgaben mit Datum.
- Diese Woche nutzt Montag bis Sonntag.
- Naechste Woche nutzt die Folgewoche Montag bis Sonntag.
- Markiert zeigt offene markierte Aufgaben.
- Dringend zeigt offene Aufgaben mit `priority: high`.
- Erledigte und archivierte Aufgaben erscheinen nicht standardmaessig.

## Geplant, Woche und Kalender

- Segment `Liste` zeigt gruppierte Aufgaben.
- Segment `Woche` zeigt Montag bis Sonntag mit Anzahl je Tag.
- Ausgewaehlter Wochentag zeigt Tagesaufgaben.
- Aufgabe fuer ausgewaehlten Tag erstellen.
- Segment `Kalender` zeigt Monatsauswahl und Tagesliste.
- Aufgabe auf anderes Datum verschieben.

## Wiederholungen

- taeglich
- woechentlich
- monatlich
- jaehrlich
- alle X Tage
- alle X Wochen
- alle X Monate
- Enddatum-Fall pruefen
- Beim Abhaken bleibt die Aufgabe offen und erhaelt das naechste Datum.

## Backup

- Export enthaelt `schemaVersion: 2`, `exportedAt`, `tasks`, `lists`.
- Tasks enthalten `listId`, `isFlagged`, `recurrence`, `sortOrder`.
- Import ersetzt Daten erst nach Bestaetigung.
- Nach Import existiert `Allgemein`.
- Ungueltige Backups zerstoeren keine lokalen Daten.

## Offline Regression

Voraussetzung: App wurde einmal online geladen.

- Internet deaktivieren.
- App oeffnen.
- Aufgabe erstellen, bearbeiten, loeschen.
- Liste erstellen, bearbeiten, loeschen.
- Backup exportieren.
- App neu oeffnen und lokale Daten pruefen.
