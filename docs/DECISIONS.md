# docs/DECISIONS.md

## Getroffene Entscheidungen

### 1. App-Typ

Entscheidung:
- Progressive Web App

Begruendung:
- mobile Nutzung moeglich
- installierbar bzw. zum Startbildschirm hinzufuegbar
- offlinefaehig
- kein App Store notwendig
- pragmatisch als statische Web-App umsetzbar

### 2. Zielgeraet

Entscheidung:
- Smartphone als primaeres Zielgeraet

Begruendung:
- Nutzung soll unterwegs und schnell erfolgen.
- Desktop ist nicht Hauptziel.

### 3. Nutzerkreis

Entscheidung:
- Einzelner Nutzer

Begruendung:
- App ist nur fuer persoenliche Aufgaben gedacht.
- Keine Team- oder Freigabefunktionen noetig.

### 4. Speicherung

Entscheidung:
- lokale Speicherung in IndexedDB

Begruendung:
- keine Cloud notwendig
- offlinefaehig
- private Nutzung
- weniger technische Komplexitaet

### 5. Kein Backend und kein Login

Entscheidung:
- keine Server, APIs oder Benutzerkonten

Begruendung:
- nur ein Nutzer
- lokale Datenhaltung
- Login und Backend waeren unnoetige Komplexitaet

### 6. Frontend-Stack

Entscheidung:
- React + Vite + TypeScript

Begruendung:
- bildet die Modultrennung sauber ab
- bleibt als statische PWA ohne Backend deploybar
- TypeScript reduziert Fehler im Aufgaben- und Backup-Modell

### 7. IndexedDB-Zugriff

Entscheidung:
- IndexedDB direkt, ohne Dexie.js

Begruendung:
- erfuellt die lokale Persistenzanforderung
- vermeidet eine zusaetzliche Datenbibliothek
- haelt die Architektur klein und nachvollziehbar

### 8. CR_001 Navigation und Produktstruktur

Entscheidung:
- Hauptnavigation ist `Dashboard | Geplant | Listen | Mehr`.
- `Inbox` ist keine Hauptnavigation mehr.

Begruendung:
- CR_001 definiert Dashboard, zeitliche Planung und Listen als neue Produktstruktur.
- Aufgaben ohne Datum sind normale Listenaufgaben und benoetigen keine eigene Hauptansicht.

### 9. Default-Liste

Entscheidung:
- `Allgemein` ist fix vorhanden und nicht loeschbar.
- `Allgemein` wird nicht umbenannt.

Begruendung:
- vereinfacht Datenintegritaet und Importlogik
- stellt sicher, dass jede Aufgabe eine gueltige Liste hat
- vermeidet unnoetige UI- und Migrationskomplexitaet

### 10. Importlogik und Backup-Schema

Entscheidung:
- Backup-Schema ist Version 2 und enthaelt `tasks` und `lists`.
- Import ersetzt lokale Aufgaben und Listen erst nach expliziter Bestaetigung.
- v1-Backups werden nicht defensiv importiert.

Begruendung:
- CR_001 verlangt Schema-Version 2.
- Es gibt laut CR keine relevanten alten Daten, daher ist keine komplexe Migration erforderlich.
- Ersetzen ist einfacher pruefbar als Merge-Logik.

### 11. Manuelle Sortierung

Entscheidung:
- Manuelle Sortierung wird minimal ueber Hoch-/Runter-Buttons umgesetzt.

Begruendung:
- erfuellt das `sortOrder`-Kriterium ohne Drag & Drop
- bleibt mobile-first und risikoarm

### 12. Wiederholungen

Entscheidung:
- Wiederkehrende Aufgaben werden beim Abhaken nicht erledigt, sondern auf das naechste Faelligkeitsdatum verschoben.

Begruendung:
- entspricht Variante A aus CR_001
- vermeidet Instanzduplikate und komplexe RRULE-Logik

### 13. Kalenderintegration

Entscheidung:
- Die bestehende Kalenderansicht bleibt erhalten und ist als Segment in `Geplant` integriert.

Begruendung:
- erfuellt CR_001 ohne zusaetzliche Hauptnavigation
- haelt zeitliche Planung an einem Ort

## Offene Entscheidungen

1. Hosting-Ziel der PWA
2. Mindest-Browser-/Android-Version
3. lokale Erinnerungen spaeter ja/nein
4. PIN-Sperre spaeter ja/nein

## Bewusst verworfene oder verschobene Ideen

Nicht in CR_001:
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
- Suche
- Dark Mode
