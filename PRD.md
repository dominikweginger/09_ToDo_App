# PRD.md

## Produktname

SoloTodo PWA

## Produktbeschreibung

SoloTodo PWA ist eine private, lokal speichernde und offlinefaehige Aufgaben-Zentrale fuer eine einzelne Person. Version 2 strukturiert die App um Dashboard, zeitliche Planung, echte Listen und berechnete Smart Views.

## Zielnutzer

Ein einzelner Nutzer, der Aufgaben am Smartphone schnell erfassen, in Listen ordnen, zeitlich planen und lokal sichern moechte.

## Produktziel CR_001

SoloTodo soll als neutrale, moderne "Apple Reminders light"-PWA funktionieren, ohne ein iOS-Klon zu sein. Die App bleibt lokal, offlinefaehig und backendlos.

## Kernfunktionen

- Dashboard als Startscreen
- Smart-View-Kacheln: Heute, Geplant, Diese Woche, Naechste Woche, Markiert, Dringend
- echte Listen als Aufgabencontainer
- Default-Liste `Allgemein`
- Aufgaben liegen genau in einer Liste
- Geplant-Ansicht mit gruppierter Liste, Wochenuebersicht Montag bis Sonntag und Kalender
- bestehende Kalenderfunktion bleibt erhalten
- Aufgabe erstellen, bearbeiten, loeschen, abhaken und wieder oeffnen
- Markierung per `isFlagged`
- `priority: high` gilt als Dringend
- einfache Wiederholungen ohne RRULE
- manuelle Sortierung ueber `sortOrder`
- Backup-Export und Import mit Schema-Version 2

## Aufgabenfelder

- Titel
- Notiz
- Liste
- Datum
- Uhrzeit
- Prioritaet
- Markiert
- Wiederholung
- Status

## Nicht-Ziele

- kein Backend
- kein Login
- keine Cloud-Synchronisierung
- keine externe Kalenderintegration
- keine Push Notifications
- keine natuerliche Spracheingabe
- keine KI-Funktionen
- keine Teamfunktionen
- keine geteilten Listen
- keine Anhaenge
- keine Subtasks
- kein Kanban
- kein Habit Tracker
- kein Pomodoro
- kein Dark Mode
- kein App-Icon-Redesign
- keine native Android- oder iOS-App
- keine komplexen RRULE-Wiederholungen
- keine Tags/Labels im UI
- keine Suche in dieser Version

## Akzeptanzkriterien

- Die Hauptnavigation lautet `Dashboard | Geplant | Listen | Mehr`.
- Die App startet auf dem Dashboard.
- Die alte Inbox ist nicht mehr Teil der Hauptnavigation.
- Jede Aufgabe hat eine gueltige `listId`.
- `Allgemein` existiert automatisch und kann nicht geloescht werden.
- Listen koennen erstellt, umbenannt und geloescht werden.
- Beim Loeschen einer nicht leeren Liste wird die Anzahl betroffener Aufgaben bestaetigt.
- Smart Views zeigen nur offene, nicht archivierte Aufgaben.
- Wiederkehrende Aufgaben bleiben beim Abhaken offen und erhalten das naechste Faelligkeitsdatum.
- Backup v2 enthaelt Tasks und Listen.
- Keine Cloud-, Login- oder Backend-Abhaengigkeit existiert.
