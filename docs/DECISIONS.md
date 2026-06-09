# docs/DECISIONS.md

## Getroffene Entscheidungen

### 1. App-Typ

Entscheidung:
- Progressive Web App

Begründung:
- mobile Nutzung möglich
- installierbar bzw. zum Startbildschirm hinzufügbar
- offlinefähig
- kein App Store notwendig
- pragmatisch als statische Web-App umsetzbar

### 2. Zielgerät

Entscheidung:
- Smartphone als primäres Zielgerät

Begründung:
- Nutzung soll unterwegs und schnell erfolgen.
- Desktop ist nicht Hauptziel.

### 3. Nutzerkreis

Entscheidung:
- Einzelner Nutzer

Begründung:
- App ist nur für persönliche Aufgaben gedacht.
- Keine Team- oder Freigabefunktionen nötig.

### 4. Speicherung

Entscheidung:
- lokale Speicherung

Begründung:
- keine Cloud notwendig
- offlinefähig
- private Nutzung
- weniger technische Komplexität

### 5. Kein Backend

Entscheidung:
- MVP ohne Server, API oder Backend

Begründung:
- keine Synchronisierung geplant
- weniger Wartung
- schnellerer MVP

### 6. Kein Login

Entscheidung:
- keine Benutzerkonten im MVP

Begründung:
- nur ein Nutzer
- lokale Datenhaltung
- Login wäre unnötige Komplexität

### 7. Backup

Entscheidung:
- JSON-Export und JSON-Import sind MVP-Bestandteil

Begründung:
- lokale Daten können verloren gehen
- Backup ist ohne Cloud wichtig

### 8. Frontend-Stack

Entscheidung:
- React + Vite + TypeScript

Begründung:
- bildet die dokumentierte Modultrennung sauber ab
- bleibt als statische PWA ohne Backend deploybar
- TypeScript reduziert Fehler im Task-Modell und bei Import/Export

### 9. IndexedDB-Zugriff

Entscheidung:
- IndexedDB direkt, ohne Dexie.js

Begründung:
- erfüllt die lokale Persistenzanforderung
- vermeidet eine zusätzliche Datenbibliothek im MVP
- hält die Architektur klein und nachvollziehbar

### 10. Importlogik MVP

Entscheidung:
- JSON-Import ersetzt bestehende Aufgaben erst nach expliziter Bestätigung.

Begründung:
- schützt vor stillschweigender Datenzerstörung
- ist einfacher prüfbar als Merge-Logik
- erfüllt die Backup-Anforderung des MVP ohne Konfliktregeln vorzuziehen

## Offene Entscheidungen

1. Finaler Projektname
2. Kategorien im MVP oder erst nach MVP
3. Wiederkehrende Aufgaben im MVP oder erst Version 2
4. lokale Erinnerungen später ja/nein
5. PIN-Sperre später ja/nein
6. Hosting-Ziel der PWA
7. Mindest-Browser-/Android-Version

## Bewusst verworfene oder verschobene Ideen

Nicht im MVP:
- native Android-App
- iOS-App
- Cloud-Sync
- Login
- Teamfunktionen
- Google-/Outlook-Kalenderintegration
- Kanban-Board
- KI-Funktionen
- lokale Benachrichtigungen
- CSV-Import/Export

## Entscheidungsregel

Neue Funktionen dürfen nur ergänzt werden, wenn sie:

- nicht gegen Nicht-Ziele verstoßen
- den MVP nicht destabilisieren
- in PRD und Technical Spec nachgezogen werden
- in Tests berücksichtigt werden
