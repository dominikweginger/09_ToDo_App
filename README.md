# SoloTodo PWA

## Zweck

SoloTodo PWA ist eine persoenliche, mobile To-Do-App fuer einen einzelnen Nutzer. Die App speichert Aufgaben und Listen lokal im Browserkontext, funktioniert nach dem ersten Laden offline und verzichtet bewusst auf Backend, Login und Cloud-Synchronisierung.

## Projektstatus

Status: **SoloTodo V2 / CR_001 umgesetzt**

Umgesetzt:
- React + Vite + TypeScript als mobile-first PWA
- lokale Persistenz in IndexedDB mit Stores fuer Aufgaben und Listen
- Hauptnavigation: `Dashboard | Geplant | Listen | Mehr`
- Dashboard mit Smart-View-Kacheln und Meine-Listen-Bereich
- echte Listen mit fixer Default-Liste `Allgemein`
- Aufgaben mit Liste, Datum, Uhrzeit, Prioritaet, Markierung, Notiz und einfacher Wiederholung
- Smart Views fuer Heute, Geplant, Diese Woche, Naechste Woche, Markiert und Dringend
- Geplant-Ansicht mit Liste, Wochenuebersicht und integrierter Kalenderansicht
- JSON-Export und JSON-Import mit Backup-Schema v2 fuer Tasks und Listen
- Service Worker und Web App Manifest fuer Offline-Nutzung nach erstem Laden
- Tests fuer Domain-Logik, Wiederholungen und Backup-Import/Export

## Nicht-Ziele

- Kein Login
- Keine Cloud-Synchronisierung
- Kein Backend
- Keine externe Kalenderintegration
- Keine Push Notifications
- Keine KI-Funktionen
- Keine Teamfunktionen
- Kein Kanban-Board
- Keine native Android- oder iOS-App
- Kein Dark Mode
- Keine Suche in dieser Version

## Setup

Voraussetzung:
- Node.js mit npm

Installation:

```bash
npm install
```

Entwicklungsserver:

```bash
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Installierte PWA aktualisieren

Bei einem neuen Deployment prueft die App beim Start und beim Zurueckwechseln in den Vordergrund auf eine neue Version. Wenn ein Update aktiv ist, erscheint der Hinweis `Neue Version verfuegbar. Neu laden.`. Tippe darauf, um die installierte PWA mit der neuen App-Shell neu zu laden.

Falls ein Handy trotzdem eine alte Version zeigt:
- App vollstaendig schliessen und erneut oeffnen.
- Im Browser die App-URL einmal normal oeffnen und neu laden.
- Bei hartnaeckigem Cache: installierte PWA entfernen und erneut zum Startbildschirm hinzufuegen. Lokale Aufgaben liegen im Browserkontext; vor dem Entfernen bei Bedarf ein JSON-Backup exportieren.

## Technische Entscheidungen

- Frontend-Stack: React + Vite + TypeScript
- Lokale Datenbank: IndexedDB direkt
- Importlogik: Backup ersetzt lokale Tasks und Listen erst nach expliziter Bestaetigung
- Default-Liste: `Allgemein` ist fix vorhanden und nicht loeschbar
- Wiederholungen: Beim Abhaken wird dieselbe Aufgabe auf das naechste Faelligkeitsdatum verschoben
