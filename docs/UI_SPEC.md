# docs/UI_SPEC.md

## Ziel

Diese Spezifikation beschreibt die aktuell implementierte mobile Benutzeroberflaeche von SoloTodo V2 nach CR_003.

Status: **kanonische UI-Spezifikation** (18.07.2026).

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
- sieben Smart-View-Kacheln: Heute, Geplant, Diese Woche, Naechste Woche, Markiert, Dringend, Ohne Datum
- jede Kachel zeigt Icon, Label und offene Anzahl
- Bereich `Meine Listen` mit offenen Aufgaben je Liste
- Smart-View-Zahlen blenden undatierte Checklistenaufgaben aus; die Zaehler unter `Meine Listen` zeigen sie weiterhin in ihrer eigenen Liste

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
- Nutzerlisten bearbeiten und loeschen

Das Listenformular bietet beim Erstellen und Bearbeiten:
- Listenname
- Checkbox `Checkliste`
- Hilfetext `Aufgaben ohne Datum aus dieser Liste werden nur in der Liste angezeigt.`

Beim Erstellen ist die Checkbox aus. Beim Bearbeiten sind Name und Checklistenstatus vorausgefuellt. `Allgemein` kann nicht ueber das Formular bearbeitet werden.

## Listendetail

Zeigt Aufgaben einer Liste mit Filtern:

```text
Offen | Erledigt | Markiert
```

Erledigte Aufgaben sind standardmaessig ausgeblendet.

Auch undatierte Checklistenaufgaben bleiben hier in den passenden Filtern sichtbar. Der globale Checklistenfilter gilt nicht fuer die eigene Liste.

## Mehr und Alle Aufgaben

- `Mehr` bietet Backup-Export, bestaetigten Import, App-Version und Speicherdiagnose.
- Die angezeigte Backup-Anzahl umfasst alle an `Mehr` uebergebenen, nicht archivierten Tasks.
- `Alle Aufgaben` zeigt offene und erledigte, aber keine archivierten Tasks; undatierte Checklistenaufgaben sind dort ausgeblendet.
- Export und Import werden durch die Checklisten-Darstellungsfilterung nicht eingeschraenkt. Archivierte Records liegen bereits ausserhalb des an `Mehr` uebergebenen Bestands und werden daher nicht exportiert.

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
