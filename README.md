# SoloTodo PWA

## Zweck

SoloTodo PWA ist eine persönliche, mobile To-Do-App mit Kalenderfokus. Die App ist für einen einzelnen Nutzer gedacht, speichert Aufgaben lokal auf dem Gerät und soll nach dem ersten Laden auch offline funktionieren.

## Projektstatus

Status: **MVP lokal umgesetzt**

Umgesetzt:
- mobile-first Frontend-App mit React, Vite und TypeScript
- lokale Aufgabenpersistenz in IndexedDB
- Heute-, Kalender-, Inbox- und Mehr-Ansicht
- Aufgaben erstellen, bearbeiten, löschen, erledigen und wieder öffnen
- Aufgaben mit Datum, Uhrzeit, Priorität und Notiz
- JSON-Export und JSON-Import mit Bestätigung vor Ersetzen
- Service Worker und Web App Manifest für PWA/Offline-Fähigkeit nach erstem Laden
- Basistests für Domain-Logik und Backup-Import/Export

## Zielbild

Der Nutzer öffnet die App am Smartphone, sieht seine heutigen Aufgaben, kann neue Aufgaben schnell erfassen, Aufgaben im Kalender planen, Aufgaben ohne Datum in der Inbox sammeln und alle Daten lokal per JSON sichern.

## Hauptfunktionen im MVP

- Aufgaben erstellen, bearbeiten, löschen und erledigen
- Heute-Ansicht mit heutigen und überfälligen offenen Aufgaben
- Kalenderansicht mit Monatsauswahl und Tagesliste
- Inbox für Aufgaben ohne Datum
- lokale Speicherung
- Offline-Nutzung nach erstem Laden
- JSON-Export und JSON-Import
- mobile-first Bedienung

## Nicht-Ziele

- Kein Login
- Keine Cloud-Synchronisierung
- Keine Teamfunktionen
- Kein Backend
- Keine externe Kalenderintegration im MVP
- Keine native Android-App im ersten Schritt

## Projektstruktur

```text
.
├── README.md
├── PRD.md
├── TECHNICAL_SPEC.md
├── IMPLEMENTATION_PLAN.md
├── TEST_PLAN.md
├── AGENTS.md
├── docs/
│   ├── UI_SPEC.md
│   ├── DATA_MODEL.md
│   ├── DECISIONS.md
│   └── PROMPTS.md
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
└── src/
    ├── app/
    ├── components/
    ├── data/
    ├── domain/
    ├── tests/
    └── views/
```

## Setup

Voraussetzung:
- Node.js mit npm

Installation:

```bash
npm install
```

## Lokaler Start

Entwicklungsserver:

```bash
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

Lokale Vorschau des Produktionsbuilds:

```bash
npm run preview
```

Tests:

```bash
npm test
```

## Technische Entscheidungen

- Frontend-Stack: React + Vite + TypeScript
- Lokale Datenbank: IndexedDB direkt
- Importlogik: Backup ersetzt bestehende Aufgaben erst nach expliziter Bestätigung
- Keine Backend-, Login-, Cloud- oder Kalenderintegrations-Abhängigkeit

## Wichtige Hinweise für Codex

- Der Blueprint ist die fachliche Grundlage.
- Kein Backend erstellen.
- Kein Login erstellen.
- Keine Cloud-Synchronisierung ergänzen.
- MVP vor Erweiterungen.
- Offline-Fähigkeit und lokale Speicherung sind Kernanforderungen.
