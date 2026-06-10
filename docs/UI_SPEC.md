# docs/UI_SPEC.md

## Ziel

Diese Spezifikation beschreibt die mobile Benutzeroberflaeche von SoloTodo V2 nach CR_001.

## Grundprinzipien

- mobile-first
- neutral-modern
- hell und ruhig
- kachelbasiert, aber nicht ueberladen
- gute Lesbarkeit
- grosse Touch-Ziele
- keine iOS-Glasoptik
- kein Dark Mode
- keine sichtbare Suche in dieser Version

## Hauptnavigation

Die Bottom Navigation hat vier Tabs:

```text
Dashboard | Geplant | Listen | Mehr
```

Die App startet auf dem Dashboard. `Inbox` ist keine Hauptnavigation mehr.

## Globale Aktion

Der Floating Action Button `+ Aufgabe` oeffnet das Task-Formular.

Vorauswahl:
- Dashboard: `Allgemein`
- Listendetail: geoeffnete Liste
- Heute: heutiges Datum
- Markiert: `isFlagged`
- Dringend: `priority: high`
- Woche/Kalender: ausgewaehltes Datum

## Dashboard

Inhalt:
- Titel `SoloTodo`
- sechs Smart-View-Kacheln: Heute, Geplant, Diese Woche, Naechste Woche, Markiert, Dringend
- jede Kachel zeigt Icon, Label und offene Anzahl
- Bereich `Meine Listen` mit offenen Aufgaben je Liste

## Geplant

Segment:

```text
Liste | Woche | Kalender
```

- `Liste`: Heute, Morgen, Diese Woche, Naechste Woche, Spaeter
- `Woche`: Montag bis Sonntag, Datum und offene Anzahl je Tag
- `Kalender`: Monatskalender mit Tagesliste

## Listen

Die Listenuebersicht zeigt:
- `Allgemein`
- Nutzerlisten
- Anzahl offener Aufgaben
- neue Liste erstellen
- Nutzerlisten umbenennen und loeschen

## Listendetail

Zeigt Aufgaben einer Liste mit Filtern:

```text
Offen | Erledigt | Markiert
```

Erledigte Aufgaben sind standardmaessig ausgeblendet.

## Aufgabenkarte

Eine Aufgabe zeigt:
- Status-Schalter
- Titel
- Datum/Uhrzeit
- Prioritaet
- Listenname, wenn relevant
- Markierung
- Wiederholungsindikator
- Bearbeiten, Loeschen, optional Markieren und Sortieren

## Task-Formular

Felder:
- Titel
- Notiz
- Liste
- Datum
- Uhrzeit
- Prioritaet
- Status
- Markiert
- Wiederholung mit Rhythmus und Intervall

Quick Actions:
- Heute
- Morgen
- Diese Woche
- Naechste Woche
- Ohne Datum
