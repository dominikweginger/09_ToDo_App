# docs/UI_SPEC.md

## Ziel

Diese Spezifikation beschreibt die mobile Benutzeroberfläche von SoloTodo PWA.

## Grundprinzipien

- mobile-first
- Touch-Bedienung
- kurze Wege
- große Bedienelemente
- wenig visuelle Ablenkung
- Aufgaben schnell erfassen
- Kalenderbezug klar sichtbar

## Hauptnavigation

Die App nutzt eine Bottom Navigation mit vier Tabs:

```text
Heute | Kalender | Inbox | Mehr
```

Die Navigation bleibt in den Hauptansichten sichtbar.

## Globale Aktion

Ein gut sichtbarer Button öffnet die Aufgabenerfassung:

```text
+ Aufgabe
```

Empfohlene Position:
- unten rechts oder prominent im unteren Bereich
- darf Bottom Navigation nicht verdecken

## Ansicht: Heute

Zweck:
- Tagesplanung und schnelle Abarbeitung

Inhalt:
- überfällige offene Aufgaben
- heutige offene Aufgaben
- optional Hinweis, wenn keine Aufgaben vorhanden sind

Interaktionen:
- Aufgabe abhaken
- Aufgabe antippen und bearbeiten
- Aufgabe verschieben
- neue Aufgabe erstellen

## Ansicht: Kalender

Zweck:
- Aufgaben nach Datum planen und prüfen

Inhalt:
- Monatsansicht oder einfache Kalenderübersicht
- markierte Tage mit Aufgaben
- Tagesliste für ausgewählten Tag

Interaktionen:
- Tag auswählen
- Aufgabe für ausgewählten Tag erstellen
- Aufgabe auf anderes Datum verschieben
- Aufgabe öffnen und bearbeiten

## Ansicht: Inbox

Zweck:
- Aufgaben ohne Datum sammeln und später einplanen

Inhalt:
- alle offenen Aufgaben ohne Fälligkeitsdatum
- Sortierung nach Erstellungsdatum

Interaktionen:
- Datum setzen
- Aufgabe bearbeiten
- Aufgabe erledigen
- Aufgabe löschen

## Ansicht: Mehr / Einstellungen

Zweck:
- Verwaltungsfunktionen

MVP-Inhalt:
- Backup exportieren
- Backup importieren
- App-Information
- Projekt-/Versionshinweis

Später:
- Dark Mode
- Kategorien
- PIN-Sperre
- Backup-Erinnerung

## Aufgabenkarte

Eine Aufgabe wird kompakt dargestellt:

```text
☐ Aufgabe
Datum/Uhrzeit · Priorität · Kategorie
Notiz vorhanden
```

Mindestbestandteile:
- Checkbox oder Statussymbol
- Titel
- Datumshinweis, falls vorhanden
- Priorität, falls gesetzt

## Task-Formular

Felder:
- Titel
- Notiz
- Datum
- Uhrzeit
- Priorität
- Kategorie optional/später
- Status

Regeln:
- Titel ist Pflicht.
- Speichern ist bei leerem Titel nicht erlaubt.
- Abbrechen verwirft ungespeicherte Änderungen nach Bestätigung, falls nötig.

## Fehler- und Leerzustände

Beispiele:
- Keine Aufgaben heute
- Keine Aufgaben in der Inbox
- Import fehlgeschlagen
- Speichern nicht möglich
- Offline verfügbar / offline aktiv

Meldungen sollen kurz und verständlich sein.
