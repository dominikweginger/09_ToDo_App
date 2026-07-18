# PRODUCT_RESEARCH.md

> **Historische Research-Unterlage (Stand 10.06.2026).** Empfehlungen und Zukunftsideen in diesem Dokument sind nicht automatisch umgesetzt oder verbindlich. Fuer den aktuellen Stand gelten `../PRD.md` und `CHANGELOG.md`.

Stand: 2026-06-10  
Projekt: `09_ToDo_App` / SoloTodo PWA  
Ziel: Fachliche Grundlage für die sinnvolle Weiterentwicklung der bestehenden lokalen, offlinefähigen ToDo-PWA.  
Hinweis: Dieses Dokument enthält nur Produktrecherche und Empfehlungen. Es beschreibt keine Codeänderungen.

---

## 1. Ausgangslage der bestehenden App

Aus den vorhandenen Projektdokumenten ergibt sich folgendes Bild:

- SoloTodo PWA ist eine persönliche, mobile ToDo-App mit Kalenderfokus.
- Die App ist für einen einzelnen Nutzer gedacht.
- Speicherung erfolgt lokal auf dem Gerät, ohne Login, Backend, Cloud-Synchronisierung oder Teamfunktionen.
- Bereits umgesetzt bzw. vorgesehen sind:
  - Heute-Ansicht
  - Kalenderansicht
  - Inbox für Aufgaben ohne Datum
  - Mehr-/Einstellungen-Ansicht
  - Aufgaben erstellen, bearbeiten, löschen, erledigen und wieder öffnen
  - Datum, Uhrzeit, Priorität und Notiz
  - lokale Speicherung in IndexedDB
  - JSON-Import/-Export
  - PWA-/Offline-Fähigkeit nach erstem Laden

Damit ist die App fachlich bereits näher an Apple Reminders / Google Tasks als an Todoist oder TickTick. Das ist gut. Für eine persönliche PWA wäre es nämlich grober Unfug, sofort Todoist nachzubauen. Das wäre kein Produkt, sondern ein Scheidungsgrund zwischen Nutzer und App.

---

## 2. Quellen und öffentlich verfügbare Referenzen

### Apple Reminders

- Apple Support – Smart Lists in Reminders on iPhone  
  https://support.apple.com/en-is/guide/iphone/iphe882772ed/ios
- Apple Support – Use Reminders on iPhone, iPad or iPod touch  
  https://support.apple.com/en-us/102484
- Apple Support – View reminder lists on Mac  
  https://support.apple.com/guide/reminders/view-reminder-lists-remnd854fc47/mac
- Apple App Store – Reminders  
  https://apps.apple.com/us/app/reminders/id1108187841

### Microsoft To Do

- Microsoft Support – Welcome to Microsoft To Do  
  https://support.microsoft.com/en-us/office/welcome-to-microsoft-to-do-762cbbf9-7fc1-48e5-b619-005622da89d0
- Microsoft Support – Add due dates and reminders in Microsoft To Do  
  https://support.microsoft.com/en-US/ToDo/add-due-dates-and-reminders-in-microsoft-to-do
- Microsoft Support – Smart due date, reminder recognition  
  https://support.microsoft.com/en-US/ToDo/smart-due-date-reminder-recognition-in-microsoft-to-do

### Todoist

- Todoist Help – Task view  
  https://www.todoist.com/help/articles/use-the-task-view-to-manage-tasks-in-todoist-eDeRDO0C
- Todoist Help – Recurring dates  
  https://www.todoist.com/help/articles/introduction-to-recurring-dates-YUYVJJAV
- Todoist Help – Filters  
  https://www.todoist.com/help/articles/introduction-to-filters-V98wIH
- Todoist Help – Priority  
  https://www.todoist.com/help/articles/set-a-priority-in-todoist-Wy82Jp
- Todoist Help – Glossary  
  https://www.todoist.com/help/articles/todoist-glossary-cA60laWMH

### TickTick

- TickTick official website  
  https://ticktick.com/?language=en_US
- TickTick Help – Manage tasks with lists  
  https://help.ticktick.com/articles/7055782283059396608
- TickTick Help – Recurring tasks  
  https://help.ticktick.com/articles/7055782206349770752
- TickTick Help – Eisenhower Matrix  
  https://help.ticktick.com/articles/7055782055577124864

### Google Tasks

- Google Workspace – Google Tasks product page  
  https://workspace.google.com/products/tasks/
- Google Tasks Help – Manage repeating tasks in Google Tasks and Google Calendar  
  https://support.google.com/tasks/answer/12132599

---

## 3. Welche Kernfunktionen moderne ToDo-Apps haben

Moderne ToDo-Apps bestehen im Kern nicht aus „Aufgaben abhaken“. Das ist nur die glorifizierte Einkaufsliste. Gute ToDo-Apps kombinieren mehrere Konzepte:

### 3.1 Aufgaben erfassen

Typische Felder:

- Titel
- Notiz/Beschreibung
- Status: offen, erledigt, archiviert
- Fälligkeitsdatum
- optionale Uhrzeit
- Priorität
- Liste/Projekt/Kategorie
- Markierung/Favorit/Flag
- Wiederholung
- optional Subtasks
- optional Tags/Labels
- optional Anhänge/Kommentare

### 3.2 Aufgaben organisieren

Typische Organisationslogiken:

- Manuelle Listen, z. B. Privat, Arbeit, Einkauf, Urlaub
- Projekte, z. B. „App weiterentwickeln“, „Fuerteventura“, „Monatsabschluss“
- Tags/Labels, z. B. Telefon, Einkauf, Wichtig, Warten auf
- Prioritäten
- Flags/Sterne für besonders wichtige Aufgaben
- Inbox für noch unsortierte Aufgaben

### 3.3 Aufgaben zeitlich planen

Typische Planungsfunktionen:

- Heute
- Morgen
- Diese Woche
- Nächste Woche
- Geplant / Scheduled
- Überfällig
- Kalenderansicht
- Wiederkehrende Aufgaben
- Erinnerungen / Notifications

### 3.4 Aufgaben filtern und fokussieren

Typische Fokusansichten:

- Heute
- Geplant
- Markiert
- Alle
- Erledigt
- Überfällig
- Nach Liste
- Nach Priorität
- Nach Tag/Label
- Benutzerdefinierte Filter / Smart Lists

### 3.5 Bedienkomfort

Typische Komfortfunktionen:

- Schnellerfassung
- Quick Actions: Heute, Morgen, Nächste Woche, Ohne Datum
- Natürliche Sprache: „Zahnarzt morgen 9 Uhr“
- Drag & Drop oder einfaches Verschieben
- Suche
- Sortierung
- Dark Mode
- Backup/Export
- Synchronisation über Geräte
- Widgets / Startbildschirm

### 3.6 Fortgeschrittene Funktionen

Typische Profi- oder Power-User-Funktionen:

- Zusammenarbeit
- Teilen von Listen
- Zuweisung an Personen
- Kommentare
- Dateianhänge
- Kalenderintegration
- E-Mail-Integration
- Habit Tracker
- Pomodoro Timer
- Eisenhower Matrix
- Kanban Boards
- KI-Planung
- Automatische Vorschläge

Für SoloTodo PWA sind die Punkte 3.1 bis 3.4 relevant. Die Punkte 3.5 teilweise. Die Punkte 3.6 sind für Version 1 überwiegend zu groß.

---

## 4. Analyse: Apple Reminders

Apple Reminders ist für SoloTodo die beste Referenz, weil es relativ einfach wirkt, aber trotzdem eine saubere Aufgabenlogik besitzt.

### 4.1 Grundkonzept

Apple Reminders unterscheidet zwischen:

- normalen Listen
- Smart Lists
- einzelnen Erinnerungen/Aufgaben
- geplanten Aufgaben
- markierten Aufgaben
- erledigten Aufgaben
- optional geteilten bzw. zugewiesenen Aufgaben

Wichtig: Smart Lists sind keine echten Datencontainer. Sie sind dynamische Ansichten auf dieselben Aufgaben.

Beispiel:

- Eine Aufgabe liegt in der Liste „Privat“.
- Sie hat ein Fälligkeitsdatum heute.
- Dann erscheint sie zusätzlich automatisch in „Heute“.
- Wird sie markiert, erscheint sie zusätzlich in „Markiert“.
- Wird sie erledigt, erscheint sie in „Erledigt“.

Das ist die wichtigste Produktlogik für deine App.

---

## 5. Apple Reminders: Listen

### 5.1 Was sind Listen?

Listen sind manuelle Sammlungen oder Bereiche, in denen Aufgaben fachlich abgelegt werden.

Beispiele:

- Privat
- Arbeit
- Einkaufen
- Reisen
- Finanzen
- Ideen
- Projekte
- Gesundheit

Eine Liste beantwortet die Frage:

> In welchen Lebensbereich oder Kontext gehört diese Aufgabe?

Sie beantwortet nicht primär:

> Wann ist diese Aufgabe fällig?

Dafür gibt es Datum, Heute, Geplant und Kalender.

### 5.2 Warum Listen sinnvoll sind

Listen verhindern, dass alles in einer einzigen chaotischen Aufgabenwurst landet. Ohne Listen hast du nach 40 Aufgaben ein digitales Kompostsystem. Mit Listen kannst du Aufgaben fachlich trennen.

### 5.3 Empfehlung für SoloTodo

Listen sind für deine App sinnvoll, aber nicht als hochkomplexe Projektverwaltung.

Empfohlene V1-Umsetzung:

- einfache Listen anlegen
- Liste umbenennen
- Liste löschen nur, wenn leer oder nach Bestätigung inklusive Umgang mit enthaltenen Aufgaben
- Farbe oder Icon optional
- Aufgabe genau einer Liste zuordnen
- Standardliste definieren, z. B. „Allgemein“ oder „Inbox“

Nicht nötig in V1:

- Listen teilen
- Listen-Gruppen
- verschachtelte Listen
- Teamzuweisung
- komplexe Berechtigungen

---

## 6. Apple Reminders: Smart Lists

Apple bietet standardmäßig mehrere Smart Lists. Für SoloTodo sind besonders diese relevant:

### 6.1 Heute

Bedeutung:

- zeigt Aufgaben, die heute fällig sind
- zeigt auch überfällige offene Aufgaben

Empfehlung für SoloTodo:

- Heute bleibt die wichtigste Startansicht
- klare Unterteilung:
  - Überfällig
  - Heute
  - Optional: Ohne Uhrzeit / Mit Uhrzeit

### 6.2 Geplant / Scheduled

Bedeutung:

- zeigt Aufgaben mit Datum oder Uhrzeit
- nicht nur heute, sondern alle terminierten Aufgaben

Empfehlung für SoloTodo:

- eine Ansicht „Geplant“ ergänzen
- gruppiert nach:
  - Heute
  - Morgen
  - Diese Woche
  - Nächste Woche
  - Später
- Diese Ansicht ist vermutlich wichtiger als ein voller Monatskalender, weil sie direkt beantwortet: „Was kommt auf mich zu?“

### 6.3 Markiert / Flagged

Bedeutung:

- zeigt Aufgaben, die der Nutzer bewusst markiert hat
- unabhängig von Datum oder Liste

Empfehlung für SoloTodo:

- Feld `isFlagged: boolean` ergänzen
- Ansicht „Markiert“ oder Filterchip in „Mehr“/„Alle“ ergänzen
- Nutzen: Aufgaben, die nicht zwingend heute fällig sind, aber im Blick bleiben müssen

### 6.4 Alle

Bedeutung:

- zeigt alle Aufgaben über alle Listen hinweg

Empfehlung für SoloTodo:

- sinnvoll als „Alle Aufgaben“
- optional mit Suche und Filter
- nicht zwingend in der Bottom Navigation, eher unter „Mehr“ oder als eigene Übersicht

### 6.5 Erledigt / Completed

Bedeutung:

- zeigt erledigte Aufgaben

Empfehlung für SoloTodo:

- sinnvoll, aber nicht prominent
- unter „Mehr“ oder in der Aufgabenliste als Filter
- wichtig für Kontrolle und Wiederöffnen

---

## 7. Apple Reminders: Wiederkehrende Aufgaben

Wiederkehrende Aufgaben sind ein Kernfeature moderner ToDo-Apps.

Typische Beispiele:

- Müll rausstellen jeden Dienstag
- Monatsabschluss jeden 1. Werktag
- Pflanze gießen alle 3 Tage
- Backup exportieren jeden Sonntag
- Sport 3x pro Woche

### 7.1 Grundlogik

Es gibt zwei Modellierungsarten:

#### Variante A: Aufgabe wird beim Erledigen weitergeschoben

Eine Aufgabe bleibt dieselbe Aufgabe. Wenn sie erledigt wird, wird ihr nächstes Fälligkeitsdatum berechnet und die Aufgabe wieder geöffnet.

Vorteil:

- einfach
- wenig Daten
- gut für persönliche ToDo-App

Nachteil:

- keine saubere Historie einzelner Vorkommnisse

#### Variante B: Jede Wiederholung erzeugt eigene Instanz

Bei jeder Wiederholung wird eine neue Aufgabe erzeugt.

Vorteil:

- bessere Historie
- besser für Reporting

Nachteil:

- deutlich komplexer
- Migrations- und Löschlogik schwieriger
- Kalender kann mit Zukunftsaufgaben vollgemüllt werden

### 7.2 Empfehlung für SoloTodo

Für V1 klar Variante A:

- Beim Abhaken einer wiederkehrenden Aufgabe wird das nächste Datum berechnet.
- Die Aufgabe bleibt bestehen.
- `completedAt` kann entweder kurz gesetzt und danach geleert werden, oder es wird optional ein kleines `completionLog` geführt.

Empfohlene Wiederholungen für V1:

- täglich
- wöchentlich
- monatlich
- jährlich
- alle X Tage/Wochen/Monate

Nicht für V1:

- „jeden ersten Werktag“
- „jeden zweiten Dienstag im Monat“
- „außer Feiertage“
- mehrere Termine in einer Regel
- komplexe RRULE-Bearbeitung im UI

---

## 8. Vergleich der Apps

| App | Stärken | Was SoloTodo übernehmen sollte | Was SoloTodo nicht übernehmen sollte |
|---|---|---|---|
| Apple Reminders | Einfache Listen, Smart Lists, Heute, Geplant, Markiert, Wiederholungen | Listen + Smart Views + Flag + einfache Wiederholung | iCloud Sharing, Location Alerts, Siri, Calendar-App-Integration |
| Microsoft To Do | My Day, Planned, Listen, Schritte, Notizen, Wiederholung, Smart Date Recognition | Heute/Geplant-Logik, Quick-Date-Aktionen, einfache Steps später | Microsoft-Ökosystem, Datei-Anhänge, komplexe Integration |
| Todoist | Projekte, Labels, Filter, Prioritäten, natürliche Sprache, Wiederholung | Prioritäten, Filteridee, natürliche Sprache später | Kollaboration, Kommentare, Attachments, Power-User-Filter in V1 |
| TickTick | Kalender, Habits, Pomodoro, Eisenhower, sehr breiter Funktionsumfang | Kalenderfokus, Heute/Diese Woche, einfache Priorisierung | Habit Tracker, Pomodoro, Eisenhower Matrix in V1 |
| Google Tasks | Sehr simpel, Listen, Subtasks, Datum/Uhrzeit, Wiederholung, Star, Kalendernähe | Schlichtheit, Listen, Stern/Markierung, Subtasks später | Google-Sync, Workspace-Integration, Delegation |

---

## 9. Welche Funktionen für SoloTodo sinnvoll wären

### 9.1 Sehr sinnvoll für die nächste Produktversion

#### 1. Listen

Begründung:

- wichtigste Erweiterung nach Datum/Kalender
- schafft Ordnung ohne Komplexität
- passt zu Apple Reminders, Microsoft To Do und Google Tasks

Umfang:

- Liste anlegen
- Liste bearbeiten
- Liste löschen
- Aufgabe einer Liste zuordnen
- Listenansicht anzeigen

#### 2. Geplant / Diese Woche / Nächste Woche

Begründung:

- Nutzer wollen nicht nur „heute“ sehen
- die Frage „Was ist diese und nächste Woche zu erledigen?“ ist zentral
- ist einfacher und praktischer als ein überladener Kalender

Umfang:

- Aufgaben nach Datum gruppieren
- Überfällig
- Heute
- Morgen
- Diese Woche
- Nächste Woche
- Später

#### 3. Markiert / Flag

Begründung:

- extrem einfaches Datenfeld
- hoher Nutzen
- gute Ergänzung zu Priorität

Unterschied zu Priorität:

- Priorität sagt: „Wie wichtig?“
- Markiert sagt: „Im Blick behalten.“

#### 4. Einfache wiederkehrende Aufgaben

Begründung:

- echter Alltagsnutzen
- Aufgaben wie Müll, Backup, Sport, Monatsabschluss werden damit deutlich besser abbildbar

Umfang V1:

- täglich
- wöchentlich
- monatlich
- jährlich
- Intervall X
- nächste Fälligkeit beim Erledigen berechnen

#### 5. Quick Actions beim Datum

Begründung:

- großer Komfortgewinn
- kleiner Funktionsumfang
- sehr mobilfreundlich

Aktionen:

- Heute
- Morgen
- Dieses Wochenende
- Nächste Woche
- Ohne Datum

#### 6. Suche / einfache Gesamtübersicht

Begründung:

- bereits im PRD als Gesamtübersicht/Suche vorgesehen
- wird mit Listen und mehr Aufgaben wichtiger

Umfang:

- Suche nach Titel und Notiz
- Filter offen/erledigt
- optional Filter Liste/Priorität/Markiert

---

## 10. Funktionen, die für Version 1 zu groß oder unnötig wären

### 10.1 Cloud-Sync / Login / Backend

Nicht sinnvoll für V1, weil das gegen die aktuelle Produktstrategie verstößt. Die App ist bewusst lokal, privat und offlinefähig.

### 10.2 Teamfunktionen / Teilen / Zuweisungen

Nicht sinnvoll, weil Zielnutzer ein einzelner Nutzer ist. Außerdem würde das sofort Login, Rechte, Sync und Konfliktlösung erzwingen.

### 10.3 Vollständige Kalenderintegration

Nicht sinnvoll für V1.

Problem:

- Google/Outlook/Apple-Kalender benötigen Authentifizierung, APIs, Datenschutz- und Synchronisationslogik.
- Für eine lokale PWA zu viel Ballast.

Alternative:

- interne Kalenderansicht beibehalten
- Geplant-/Wochenansicht ergänzen

### 10.4 Push Notifications / echte Erinnerungen

Nur mit Vorsicht.

Problem:

- PWA-Notifications sind je nach Browser, Betriebssystem und Installationsstatus unterschiedlich zuverlässig.
- iOS/Android verhalten sich verschieden.
- Wiederkehrende lokale Notifications ohne Backend können mühsam werden.

Empfehlung:

- V1: Uhrzeit nur anzeigen und sortieren
- später: lokale Benachrichtigungen als eigenes technisches Projekt

### 10.5 Natürliche Sprache

Beispiel:

- „Rechnung prüfen morgen 14 Uhr monatlich“

Nicht für V1 nötig.

Empfehlung:

- zuerst Quick Actions
- natürliche Sprache später optional

### 10.6 Anhänge, Bilder, Dateien

Nicht sinnvoll für V1.

Grund:

- lokale Speicherung wird komplexer
- Backup-Dateien werden groß
- Import/Export wird fehleranfälliger

### 10.7 Tags/Labels zusätzlich zu Listen

Nicht sofort.

Grund:

- Listen + Priorität + Flag reichen für den Start
- Tags machen das Modell flexibler, aber auch erklärungsbedürftiger

Empfehlung:

- Datenmodell kann Tags vorbereiten
- UI erst später

### 10.8 Habit Tracker, Pomodoro, Eisenhower Matrix

TickTick zeigt, dass diese Funktionen interessant sind. Für SoloTodo wären sie aber aktuell Ablenkung.

Empfehlung:

- nicht in V1
- eventuell später, wenn die Grund-App wirklich täglich genutzt wird

### 10.9 Kanban Board

Nicht sinnvoll.

Grund:

- App ist eine persönliche ToDo-App, keine Projektmanagement-App
- Kanban würde Design, Navigation und Datenmodell unnötig aufblasen

---

## 11. Empfohlene Datenstruktur

Die bestehende Struktur ist bereits gut vorbereitet. Für die nächste Version sollte sie sauber erweitert werden.

### 11.1 Grundregel

Es sollte unterschieden werden zwischen:

- gespeicherten Daten
- abgeleiteten Ansichten

Gespeichert werden:

- Tasks
- Listen
- Einstellungen
- optional Completion Log

Nicht gespeichert werden:

- Heute
- Geplant
- Markiert
- Überfällig
- Diese Woche

Diese Ansichten werden aus den Taskdaten berechnet.

---

## 12. Vorschlag: Task-Modell

```json
{
  "id": "string",
  "title": "string",
  "note": "string | null",
  "status": "open | done | archived",
  "listId": "string",
  "dueDate": "YYYY-MM-DD | null",
  "dueTime": "HH:mm | null",
  "priority": "none | low | medium | high",
  "isFlagged": false,
  "recurrence": {
    "enabled": false,
    "frequency": "daily | weekly | monthly | yearly | null",
    "interval": 1,
    "endDate": "YYYY-MM-DD | null",
    "advanceMode": "scheduledDate"
  },
  "sortOrder": 0,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime",
  "completedAt": "ISO datetime | null"
}
```

### 12.1 Erklärung der wichtigsten Felder

| Feld | Bedeutung | Empfehlung |
|---|---|---|
| `listId` | Zuordnung zu einer manuellen Liste | Für Listenfunktion erforderlich |
| `dueDate` | Fälligkeitsdatum | Basis für Heute, Geplant, Kalender |
| `dueTime` | optionale Uhrzeit | Sortierung und spätere Erinnerungen |
| `priority` | Wichtigkeit | Bereits vorhanden, beibehalten |
| `isFlagged` | Markierung | Für Smart List „Markiert“ ergänzen |
| `recurrence` | Wiederholungslogik | Als Objekt statt Freitext speichern |
| `sortOrder` | manuelle Sortierung | Sinnvoll für Listen und Inbox |
| `completedAt` | Erledigungszeitpunkt | Für Erledigt-Ansicht und Historie |

---

## 13. Vorschlag: Listen-Modell

```json
{
  "id": "string",
  "name": "string",
  "color": "string | null",
  "icon": "string | null",
  "sortOrder": 0,
  "isDefault": false,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### 13.1 Standardlisten

Beim ersten Start könnten automatisch angelegt werden:

- Allgemein
- Privat
- Arbeit
- Einkauf

Oder minimalistischer:

- Allgemein

Empfehlung:

- Nur „Allgemein“ automatisch anlegen.
- Weitere Listen durch den Nutzer erstellen lassen.
- Sonst baut man wieder fremde Ordnung in das Leben des Nutzers ein. Das endet selten gut.

---

## 14. Vorschlag: Settings-Modell

```json
{
  "schemaVersion": 2,
  "defaultListId": "string",
  "startView": "today | planned | inbox",
  "showCompletedTasks": false,
  "theme": "system | light | dark",
  "weekStartsOn": "monday | sunday",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Für V1 zwingend nötig:

- `schemaVersion`
- `defaultListId`
- `weekStartsOn`

Optional:

- Theme
- Startansicht
- Erledigte anzeigen

---

## 15. Wiederholungslogik im Detail

### 15.1 Empfohlenes Verhalten

Wenn eine wiederkehrende Aufgabe erledigt wird:

1. App prüft `recurrence.enabled`.
2. Wenn false:
   - Status wird `done`.
   - `completedAt` wird gesetzt.
3. Wenn true:
   - nächstes `dueDate` wird berechnet.
   - Status bleibt oder wird wieder `open`.
   - `completedAt` kann optional protokolliert werden.
   - Aufgabe erscheint am nächsten Termin wieder.

### 15.2 Beispiel

Aufgabe:

```json
{
  "title": "Backup exportieren",
  "dueDate": "2026-06-14",
  "recurrence": {
    "enabled": true,
    "frequency": "weekly",
    "interval": 1,
    "endDate": null,
    "advanceMode": "scheduledDate"
  }
}
```

Nach Erledigung am 2026-06-14:

```json
{
  "title": "Backup exportieren",
  "dueDate": "2026-06-21",
  "status": "open"
}
```

### 15.3 Offene Produktentscheidung

Soll eine wiederkehrende Aufgabe beim Erledigen kurz als erledigt sichtbar sein?

Empfehlung:

- Für V1 nein.
- Stattdessen optional später `completionLog` ergänzen.

---

## 16. Welche Screens / Ansichten gebraucht werden

Die bestehende Bottom Navigation ist sinnvoll. Mit Listen und Smart Views sollte sie aber leicht weitergedacht werden.

### 16.1 Variante A: Minimalistische Navigation

Bottom Navigation:

```text
Heute | Geplant | Listen | Mehr
```

Kalender wäre dann innerhalb von „Geplant“ oder „Mehr“ erreichbar.

Vorteil:

- stärker an echter Nutzung orientiert
- „Geplant“ ist alltagsnäher als „Kalender“

Nachteil:

- bestehende Kalenderansicht würde weniger prominent

### 16.2 Variante B: Bestehende Navigation beibehalten

Bottom Navigation:

```text
Heute | Kalender | Inbox | Mehr
```

Zusätzliche Funktionen:

- Geplant unter „Mehr“ oder als Button in Heute
- Listen unter „Mehr“
- Markiert unter „Mehr“

Vorteil:

- weniger Umbau
- bestehende Struktur bleibt erhalten

Nachteil:

- Listen und Geplant sind etwas versteckt

### 16.3 Empfehlung

Mittelfristig ist Variante A besser:

```text
Heute | Geplant | Listen | Mehr
```

Begründung:

- Heute = Abarbeiten
- Geplant = zeitlicher Überblick
- Listen = fachliche Ordnung
- Mehr = Verwaltung, Backup, Einstellungen

Inbox wird dann nicht entfernt, sondern als spezielle Liste oder Smart View in „Listen“ geführt.

---

## 17. Empfohlene Screens im Detail

### 17.1 Heute

Zweck:

- tägliche Arbeitsliste

Inhalt:

- Überfällig
- Heute mit Uhrzeit
- Heute ohne Uhrzeit
- optional markierte Aufgaben ohne Datum als eigener Block

Aktionen:

- Aufgabe abhaken
- Aufgabe öffnen
- Aufgabe verschieben
- Aufgabe markieren
- neue Aufgabe erstellen

### 17.2 Geplant

Zweck:

- Überblick über kommende Aufgaben

Inhalt:

- Heute
- Morgen
- Diese Woche
- Nächste Woche
- Später
- optional Überfällig oben

Aktionen:

- Aufgabe verschieben
- Datum ändern
- Aufgabe öffnen

### 17.3 Listen

Zweck:

- fachliche Organisation

Inhalt:

- Liste aller manuellen Listen
- Anzahl offener Aufgaben je Liste
- Inbox / Ohne Datum als Sonderbereich
- Markiert als Smart View
- Erledigt optional

Aktionen:

- Liste öffnen
- Liste erstellen
- Liste bearbeiten
- Liste löschen

### 17.4 Listendetail

Zweck:

- Aufgaben einer Liste bearbeiten

Inhalt:

- offene Aufgaben der Liste
- optional erledigte Aufgaben einklappbar
- Filterchips: Alle, Offen, Erledigt, Markiert

Aktionen:

- Aufgabe erstellen direkt in dieser Liste
- Reihenfolge ändern optional später

### 17.5 Kalender

Zweck:

- Datumsspezifische Planung

Empfehlung:

- nicht löschen
- aber eventuell nicht als Haupttab erzwingen

Inhalt:

- Monatsansicht
- Tage mit Aufgaben markieren
- Tagesliste

### 17.6 Task-Formular / Task-Detail

Zweck:

- Aufgabe erfassen und bearbeiten

Felder:

- Titel
- Notiz
- Liste
- Datum
- Uhrzeit
- Priorität
- Markiert
- Wiederholung
- Status

Quick Actions:

- Heute
- Morgen
- Nächste Woche
- Ohne Datum

### 17.7 Mehr / Einstellungen

Inhalt:

- Backup exportieren
- Backup importieren
- App-Info
- Datenmodell-Version
- Theme später
- Einstellungen für Wochenstart
- ggf. „Erledigte Aufgaben anzeigen“

---

## 18. Priorisierte Empfehlung für die nächste Version

### Phase 1: Produktlogik sauber erweitern

1. Listenmodell einführen
2. Aufgaben einer Liste zuordnen
3. Default-Liste definieren
4. Import/Export um Listen erweitern
5. Migration von bestehenden Aufgaben auf Default-Liste

### Phase 2: Smart Views ergänzen

1. Geplant-Ansicht
2. Markiert-Feld und Markiert-Ansicht
3. Alle-Aufgaben/Suche
4. Erledigt-Ansicht oder Filter

### Phase 3: Wiederkehrende Aufgaben einfach umsetzen

1. Recurrence-Objekt ergänzen
2. UI für einfache Wiederholungen
3. Berechnung nächste Fälligkeit
4. Tests für tägliche/wöchentliche/monatliche/jährliche Wiederholung

### Phase 4: Bedienkomfort

1. Quick-Date-Actions
2. bessere leere Zustände
3. Sortierung nach Uhrzeit/Priorität
4. optional Dark Mode

---

## 19. Konkrete V1-Funktionsliste

Wenn diese App jetzt sinnvoll Richtung „Apple Reminders light“ weiterentwickelt werden soll, wäre meine empfohlene V1:

### Muss

- Listen anlegen/bearbeiten/löschen
- Aufgabe einer Liste zuordnen
- Default-Liste für bestehende und neue Aufgaben
- Geplant-Ansicht mit Heute, Morgen, Diese Woche, Nächste Woche, Später
- Markiert-Funktion
- Markiert-Ansicht oder Filter
- einfache Wiederholungen: täglich, wöchentlich, monatlich, jährlich
- Backup-Format `schemaVersion = 2`
- Migration bestehender Daten

### Soll

- Suche nach Titel und Notiz
- Quick Actions für Datum
- Erledigte Aufgaben anzeigen/ausblenden
- Sortierung nach Datum, Uhrzeit, Priorität
- klare Leerzustände

### Kann

- Dark Mode
- Icons/Farben für Listen
- einfache Subtasks
- Completion Log

---

## 20. Bewusste Nicht-Ziele für V1

- Login
- Cloud-Sync
- Backend
- Zusammenarbeit
- geteilte Listen
- Aufgaben an Personen zuweisen
- externe Kalenderintegration
- Push Notifications
- natürliche Sprache
- KI-Planung
- Dateianhänge
- Kommentare
- Tags im UI
- Habit Tracker
- Pomodoro
- Eisenhower Matrix
- Kanban Board

---

## 21. Wichtigste Produktentscheidung

Die wichtigste Entscheidung lautet:

> Soll die App eher eine simple persönliche ToDo-App bleiben oder langsam Richtung Produktivitätszentrale wachsen?

Empfehlung:

Die App sollte eine persönliche ToDo-App bleiben, aber mit den besten Konzepten aus Apple Reminders:

- manuelle Listen
- Smart Views
- Heute
- Geplant
- Markiert
- einfache Wiederholungen

Nicht nachbauen:

- Todoist als Power-User-System
- TickTick als All-in-One-Produktivitätspanzer
- Google/Microsoft/Apple-Ökosystemintegration

---

## 22. Empfohlenes Zielbild

SoloTodo PWA sollte sich fachlich so positionieren:

> Eine private, offlinefähige, mobile ToDo-App für einen Nutzer, die Aufgaben schnell erfasst, sinnvoll in Listen organisiert und über Heute, Geplant, Markiert und Kalender zuverlässig sichtbar macht.

Oder kürzer:

> Apple Reminders light – aber lokal, simpel und ohne Cloud-Gedöns.

---

## 23. Codex-Hinweise für spätere Umsetzung

Wenn Codex später auf Basis dieses Dokuments arbeiten soll, sollte die Umsetzung nicht mit UI beginnen, sondern in dieser Reihenfolge:

1. Datenmodell prüfen
2. Migration definieren
3. Domain-Logik für Smart Views schreiben
4. Tests für Smart Views schreiben
5. Listenlogik implementieren
6. UI für Listen ergänzen
7. Geplant-Ansicht ergänzen
8. Markiert-Funktion ergänzen
9. Wiederkehrende Aufgaben implementieren
10. Import/Export anpassen
11. Smoke-Test der bestehenden App durchführen

Wichtig für Codex:

- keine Cloud einbauen
- kein Backend einbauen
- keine Login-Logik einbauen
- bestehende Offlinefähigkeit erhalten
- bestehende Daten nicht zerstören
- Import/Export immer mit Schema-Version und Migration behandeln
- erst Tests für Datumslogik und Wiederholung, dann UI

---

## 24. Nächster sinnvoller Schritt

Nach diesem Research-Dokument sollte als nächstes ein `PRODUCT_DECISIONS.md` oder eine Ergänzung in `docs/DECISIONS.md` erstellt werden.

Darin sollten verbindlich entschieden werden:

1. Bottom Navigation künftig:
   - `Heute | Kalender | Inbox | Mehr`
   - oder `Heute | Geplant | Listen | Mehr`
2. Werden Kategorien in Listen umbenannt?
3. Wird `categoryId` durch `listId` ersetzt oder parallel geführt?
4. Wie werden bestehende Aufgaben migriert?
5. Welche Wiederholungen sind für Version 1 erlaubt?
6. Soll „Markiert“ als eigener Screen oder nur als Filter umgesetzt werden?

Meine Empfehlung:

- Navigation auf `Heute | Geplant | Listen | Mehr` umstellen.
- Inbox als Smart View bzw. spezielle Ansicht unter Listen führen.
- `categoryId` perspektivisch durch `listId` ersetzen.
- Einfache Wiederholungen einführen, aber keine komplexen RRULEs im UI.
- Markiert als Smart View unter Listen oder Mehr führen, nicht zwingend als Haupttab.
