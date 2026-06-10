**Design-Brief**

SoloTodo soll wie „Apple Reminders light“ wirken: schnell, ruhig, kachelbasiert, mit klaren Smart Views und darunter eigenen Listen. Es soll aber nicht wie ein iOS-Klon aussehen, sondern eine eigene lokale PWA-Identität bekommen: weniger iOS-Glas, etwas neutraler, klare mobile Web-App, starke Lesbarkeit, keine unnötigen Spielereien.

**1. Zielbild Der App**

SoloTodo ist eine private, offlinefähige Aufgaben-Zentrale für eine Person.

Startscreen:

- oben: Suchbutton, ggf. Menü/Mehr
- darunter: Dashboard-Kacheln für Smart Views
- darunter: „Meine Listen“
- unten rechts: schwebender `+` Button für schnelles Hinzufügen
- unten: Hauptnavigation

Die Kernlogik:

- Listen sind echte Container.
- Heute, Geplant, Diese Woche, Nächste Woche, Markiert und Dringend sind Smart Views.
- Eine Aufgabe liegt in genau einer Liste, kann aber zusätzlich in mehreren Smart Views erscheinen.

Beispiel: Aufgabe „Rechnung prüfen“ liegt in „Finanzen“, ist morgen fällig und dringend. Dann erscheint sie in „Finanzen“, „Geplant“, „Diese Woche“ und „Dringend“.

**2. Hauptnavigation**

Empfehlung für die nächste Produktversion:

```text
Dashboard | Geplant | Listen | Mehr
```

Begründung:

- `Dashboard`: schneller Überblick wie im Screenshot
- `Geplant`: zeitliche Planung mit Wochen-/Datumslogik
- `Listen`: fachliche Ordnung
- `Mehr`: Backup, Import/Export, Einstellungen, App-Info

Alternative, falls Architekturänderung klein bleiben soll:

```text
Heute | Kalender | Inbox | Mehr
```

Dann wären Dashboard und Listen in `Mehr` oder `Heute` eingebettet. Fachlich schwächer, aber näher am aktuellen Blueprint. Deshalb als offene Entscheidung markieren:

`Offene Entscheidung: Bottom Navigation von Heute | Kalender | Inbox | Mehr auf Dashboard | Geplant | Listen | Mehr ändern?`

**3. Screens**

**Dashboard**

Inhalt:

- Kacheln:
  - Heute
  - Geplant
  - Diese Woche
  - Nächste Woche
  - Markiert
  - Dringend
- je Kachel:
  - Icon
  - Label
  - Anzahl offener Aufgaben
  - farbiger Verlauf oder ruhige Vollfarbe
- Bereich „Meine Listen“
  - Liste mit Icon/Farbe, Name, Anzahl offener Aufgaben, Chevron
- Floating Action Button `+`

Layout ähnlich Apple Reminders, aber eigener Stil:

- weniger starke iOS-Farbverläufe
- 2-Spalten-Kachelraster
- Kartenradius ca. 12-16 px für App-Feeling
- Listenbereich als einfache helle Fläche, nicht überladen

**Heute**

Zweck: tägliche Abarbeitung.

Abschnitte:

- Überfällig
- Heute mit Uhrzeit
- Heute ohne Uhrzeit

Aktionen:

- abhaken
- öffnen/bearbeiten
- markieren
- priorisieren
- Datum verschieben
- schnelle neue Aufgabe

**Geplant**

Zweck: kommende Aufgaben verstehen.

Abschnitte:

- Heute
- Morgen
- Diese Woche
- Nächste Woche
- Später

Zusätzlich oben optional ein Segment:

```text
Liste | Woche
```

`Liste` zeigt gruppierte Aufgaben. `Woche` zeigt Montag bis Sonntag.

**Wochenübersicht**

Zweck: Montag bis Sonntag planen.

Darstellung:

- horizontale Tagesleiste Mo-So
- jeder Tag mit Datum und kleiner Aufgabenanzahl
- darunter Aufgaben des ausgewählten Tages
- leere Tage zeigen kurze Leerzustände

Regel:

- Wochenstart standardmäßig Montag
- passend zur lokalen Nutzung in Europa/Vienna

**Listenübersicht**

Inhalt:

- Inbox / Allgemein
- Nutzerlisten
- Markiert als Smart View
- Dringend als Smart View
- Erledigt optional weniger prominent

Aktionen:

- Liste anlegen
- Liste bearbeiten
- Liste löschen
- Liste öffnen

**Listendetail**

Inhalt:

- Aufgaben dieser Liste
- Filterchips: Offen, Erledigt, Markiert
- Sortierung: manuell oder nach Datum
- `+` legt Aufgabe direkt in dieser Liste an

**Aufgabe Erstellen/Bearbeiten**

Mobile Bottom Sheet oder eigene Detailseite.

Felder:

- Titel
- Notiz
- Liste
- Datum
- Uhrzeit
- Priorität/Dringend
- Markiert
- Wiederholung
- Status

Quick Actions:

- Heute
- Morgen
- Diese Woche
- Nächste Woche
- Ohne Datum

**Suche**

Eigener Overlay-Screen.

Inhalt:

- Suchfeld oben
- Ergebnisse nach Titel und Notiz
- Filterchips:
  - Offen
  - Erledigt
  - Markiert
  - Dringend
  - Liste

V1 reicht: Suche nach Titel/Notiz + offene Aufgaben zuerst.

**4. User Flows**

**Aufgabe schnell hinzufügen**

1. Nutzer tippt `+`.
2. Quick-Add öffnet sich.
3. Nutzer gibt Titel ein.
4. Optional: Datum, Liste, Dringend, Markiert setzen.
5. Speichern.
6. Aufgabe erscheint automatisch in Liste und passenden Smart Views.

**Aufgabe einer Liste zuordnen**

1. Nutzer öffnet Aufgabe.
2. Tippt auf Feld `Liste`.
3. Wählt Liste.
4. Speichern.
5. Aufgabe wird in neuer Liste angezeigt.

**Liste anlegen**

1. Nutzer öffnet `Listen`.
2. Tippt `Neue Liste`.
3. Gibt Namen ein.
4. Optional Farbe/Icon wählen.
5. Speichern.
6. Liste erscheint unter „Meine Listen“.

**Liste löschen**

1. Nutzer öffnet Listenmenü.
2. Wählt `Löschen`.
3. Wenn Liste leer: direkt nach Bestätigung löschen.
4. Wenn Liste Aufgaben enthält: Entscheidung nötig.

Offene Entscheidung:

`Beim Löschen einer nicht leeren Liste: Aufgaben ebenfalls löschen oder in Allgemein verschieben?`

MVP-Empfehlung: in `Allgemein` verschieben, nach Bestätigung.

**Wochenplanung**

1. Nutzer öffnet `Geplant`.
2. Wechselt auf `Woche`.
3. Wählt Montag bis Sonntag.
4. Sieht Tagesaufgaben.
5. Verschiebt Aufgaben per Datumsauswahl, nicht per Drag & Drop in V1.

**Wiederkehrende Aufgabe**

1. Nutzer erstellt Aufgabe.
2. Setzt Wiederholung: täglich, wöchentlich, monatlich, jährlich oder alle X Tage/Wochen/Monate.
3. Beim Abhaken berechnet die App das nächste Fälligkeitsdatum.
4. Aufgabe bleibt offen bzw. erscheint zum nächsten Termin wieder.

**5. Datenfelder Je Aufgabe**

Empfohlenes Aufgabenmodell aus UX-Sicht:

```ts
Task {
  id: string
  title: string
  note?: string
  status: "open" | "done" | "archived"
  listId: string
  dueDate?: "YYYY-MM-DD"
  dueTime?: "HH:mm"
  priority: "none" | "low" | "medium" | "high"
  isFlagged: boolean
  recurrence?: {
    enabled: boolean
    frequency?: "daily" | "weekly" | "monthly" | "yearly"
    interval: number
    endDate?: "YYYY-MM-DD"
    advanceMode: "scheduledDate"
  }
  sortOrder: number
  createdAt: string
  updatedAt: string
  completedAt?: string
}
```

UX-Begriffe:

- `isFlagged` = Markiert
- `priority: high` = Dringend
- `dueDate` steuert Heute, Geplant, Woche
- `listId` steuert „Meine Listen“

**6. Icons/Farben**

Icon-Vorschlag, z. B. mit `lucide-react`:

- Heute: `CalendarDays`
- Geplant: `CalendarClock`
- Diese Woche: `CalendarRange`
- Nächste Woche: `CalendarPlus`
- Markiert: `Flag`
- Dringend: `AlarmClock` oder `CircleAlert`
- Suche: `Search`
- Mehr: `MoreHorizontal`
- Neue Liste: `ListPlus`
- Liste: `List`
- Wiederholung: `Repeat`
- Priorität: `BadgeAlert` oder `ArrowUp`
- Aufgabe hinzufügen: `Plus`

Farbvorschlag, eigenständig aber Apple-nah:

- Heute: Blau `#3BA7F5`
- Geplant: Koralle `#F06F74`
- Diese Woche: Orange-Rot `#F26D5B`
- Nächste Woche: Amber `#F5B84B`
- Markiert: Pfirsich `#F4A35D`
- Dringend: Pink/Rot `#E84E7A`
- Listen: nutzerdefinierte Farben, aber gedeckt
- Hintergrund: sehr helles Grau `#F5F6FA`
- Text: fast schwarz `#15171A`
- Sekundärtext: `#7A7F87`

Wichtig: Nicht alles als bunte Fläche. Die Kacheln dürfen farbig sein, Aufgabenlisten sollten ruhig bleiben.

**7. Version 1**

Für Version 1 umsetzen:

- Dashboard mit 6 Smart-View-Kacheln
- Meine Listen
- Listen anlegen, umbenennen, löschen
- Aufgabe genau einer Liste zuordnen
- Default-Liste `Allgemein`
- Smart Views:
  - Heute
  - Geplant
  - Diese Woche
  - Nächste Woche
  - Markiert
  - Dringend
- Wochenübersicht Montag bis Sonntag
- Markierung `isFlagged`
- Priorität/Dringend
- einfache Wiederholungen:
  - täglich
  - wöchentlich
  - monatlich
  - jährlich
  - alle X Tage/Wochen/Monate
- Suche nach Titel und Notiz
- Quick Add
- lokale Speicherung und Import/Export mit Schema-Version
- Migration bestehender Aufgaben auf Default-Liste

**8. Später**

Später, nicht V1:

- Cloud-Sync
- Login
- Backend
- externe Kalenderintegration
- Push Notifications
- natürliche Sprache
- Tags/Labels im UI
- Subtasks
- Drag & Drop
- komplexe RRULE-Wiederholungen
- Anhänge
- Teamfunktionen
- geteilte Listen
- Kanban
- KI-Funktionen
- Habit Tracker
- Pomodoro
- Statistiken

Kurz gesagt: V1 soll die App nicht größer machen, sondern ordentlicher. Dashboard, Listen, Smart Views, Woche, Suche und Quick Add sind der sinnvolle Kern.