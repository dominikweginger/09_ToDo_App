# docs/DECISIONS.md

Status: **kanonisches Entscheidungsprotokoll** (18.07.2026). Die Entscheidungen 1 bis 20 gelten, soweit sie nicht in diesem Dokument ausdruecklich als ersetzt oder offen markiert sind.

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
- Dexie ist der Standard fuer lokale Persistenz auf IndexedDB.
- Die fruehere Entscheidung "IndexedDB direkt, ohne Dexie.js" ist verworfen.

Begruendung:
- robustere Speicherlogik und klarere Transaktionen
- bessere kontrollierte Migrationen ohne Datenverlust
- bessere Testbarkeit mit `fake-indexeddb`
- strukturierte Fehlerdiagnose mit Fehlercodes
- Vereinheitlichung mit der Architektur der Ideenapp

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

### 14. PWA-Update-Strategie

Entscheidung:
- PWA-Handling erfolgt ueber `vite-plugin-pwa`.
- Der generierte Service Worker precacht die App-Shell und bereinigt veraltete Caches.
- Neue Versionen werden ueber einen sichtbaren Neuladen-Hinweis aktiviert.
- Der alte manuelle Service Worker in `public/sw.js` wird nicht mehr verwendet.

Begruendung:
- `vite-plugin-pwa` reduziert manuelle Service-Worker-Fehler und gleicht die App an die Ideenapp an.
- Ein sichtbarer Neuladen-Hinweis vermeidet stille Versionswechsel waehrend der Nutzung.
- IndexedDB-Daten sind nicht Teil des PWA-Caches und werden durch App-Updates nicht geloescht.

### 15. Schnellerfassungsmodus fuer Aufgaben

Entscheidung:
- Neue Aufgaben starten im kompakten Modus mit Titel, Schnelldatum, Liste und Aktionen.
- Notiz, Datumseingabe, Uhrzeit, Prioritaet, Status, Markierung und Wiederholung liegen im optionalen Details-Bereich.
- Beim Bearbeiten wird der Details-Bereich automatisch geoeffnet, wenn optionale Daten vorhanden oder abweichend sind.

Begruendung:
- der wichtigste mobile Workflow ist schnelles Erfassen mit minimalem Scrollen
- bestehende Aufgabenfelder und das Datenmodell bleiben unveraendert
- Detaildaten bleiben weiterhin erreichbar und werden beim Bearbeiten nicht verdeckt verloren

### 16. Mobile Aufgabenkarte

Entscheidung:
- Aufgaben zeigen direkt nur Status, Titel, Datum, optionalen Listenkontext, wichtige Badges und `Mehr`.
- Bearbeiten, Markierung, Verschieben, Loeschen und optionale Sortierung liegen im Aktions-Sheet.
- Schnelles Verschieben nutzt Chips fuer Heute, Morgen, Naechste Woche, Ohne Datum und Datum waehlen.

Begruendung:
- Karten bleiben auf Smartphone-Breite ruhiger und besser lesbar.
- Sekundaeraktionen bleiben erreichbar, ohne die Standardkarte zu ueberladen.
- Das bestehende Aufgabenmodell und `moveTaskToDate` bleiben unveraendert.

### 17. Smart View Ohne Datum

Entscheidung:
- Aufgaben ohne Datum werden ueber die berechnete Smart View `Ohne Datum` sichtbar.
- Die Ansicht ist ueber eine Dashboard-Kachel erreichbar, aber nicht Teil der Hauptnavigation.
- Neue Aufgaben aus dieser Ansicht erhalten kein automatisches Datum.

Begruendung:
- undatierte offene Aufgaben werden planbar, ohne die alte Inbox als Hauptnavigation zurueckzubringen.
- Das bestehende Aufgabenmodell bleibt unveraendert.

### 18. Heute-Ansicht und ueberfaellige Aufgaben

Entscheidung:
- Die Smart View `Heute` zeigt ueberfaellige und heutige Aufgaben weiterhin gemeinsam im Heute-Kontext, trennt sie aber visuell in eigene Abschnitte.
- Aufgaben ohne Datum werden in `Heute` nicht als Aufgabenliste eingeblendet, sondern ueber einen Hinweis und eine Aktion zur Smart-View-Logik `Ohne Datum` abgegrenzt.

Begruendung:
- ueberfaellige Aufgaben bleiben sichtbar, ohne in der heutigen Aufgabenliste unterzugehen.
- der Tageskontext bleibt fokussiert auf Aufgaben mit faelligem Datum.
- das bestehende Aufgabenmodell und die Smart-View-Fachlogik bleiben unveraendert.

### 19. Listenformular als App-Sheet

Entscheidung:
- Listen erstellen und umbenennen erfolgt ueber ein mobiles App-Sheet statt ueber native Browser-Prompts.
- Die bestehende Listenlogik aus `list-service` bleibt die Validierungs- und Normalisierungsgrundlage.

Begruendung:
- mobile Nutzung bleibt konsistent innerhalb der App-Oberflaeche
- Validierungsfehler koennen direkt im Kontext des Formulars angezeigt werden
- Datenmodell, Backup-Schema und lokale Persistenz bleiben unveraendert

### 20. Checkliste als Listenmetadatum und zentrale globale Sichtbarkeit

Entscheidung:
- Checklisten werden ausschliesslich durch `TodoList.isChecklist: boolean` beschrieben.
- Eine zentrale Domain-Funktion blendet undatierte Checklistenaufgaben ausserhalb ihrer eigenen Liste aus.
- Eigene Listendetails, Listenzaehler und Backup-Export verwenden weiterhin alle Aufgaben.
- `Allgemein` wird immer als normale Liste normalisiert.

Begruendung:
- Aufgabenmodell, Status- und Abhaklogik bleiben einheitlich.
- Eine zentrale Regel verhindert widerspruechliches Verhalten zwischen globalen Views.
- Das nicht indexierte Zusatzfeld erfordert weder eine neue DB-Version noch eine Task-Migration.
- Backup-Schema v2 bleibt kompatibel; die Checklistenregel entfernt keine zusaetzlichen Aufgaben aus dem bisherigen nicht archivierten Exportumfang.

## Offene Entscheidungen

1. Hosting-Ziel der PWA
2. Mindest-Browser-/Android-Version
3. lokale Erinnerungen spaeter ja/nein
4. PIN-Sperre spaeter ja/nein

## Bewusst verworfene oder verschobene Ideen

Nicht im aktuellen Stand bis einschliesslich CR_003:
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
