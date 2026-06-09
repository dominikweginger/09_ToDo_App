# PRD.md

## Produktname

Arbeitstitel: **SoloTodo PWA**

Offene Entscheidung: Finaler App-Name.

## Produktbeschreibung

SoloTodo PWA ist eine persönliche To-Do-App für die mobile Nutzung. Sie kombiniert schnelle Aufgabenverwaltung mit einer einfachen Kalenderlogik. Die App funktioniert offline, speichert lokal und verzichtet bewusst auf Login, Cloud-Sync, Teamfunktionen und Backend.

## Zielnutzer

Ein einzelner Nutzer, der Aufgaben am Smartphone erfassen, planen und erledigen möchte.

Typische Nutzung:
- morgens die Heute-Ansicht prüfen
- unterwegs schnell Aufgaben erfassen
- Aufgaben später aus der Inbox terminieren
- Aufgaben im Kalender pro Tag sehen
- erledigte Aufgaben abhaken
- Daten bei Bedarf als JSON sichern

## Kernproblem

Bestehende To-Do-Apps sind für diesen Anwendungsfall oft zu umfangreich, cloudabhängig oder auf Teams und mehrere Plattformen ausgelegt. Gesucht wird eine einfache, private und offlinefähige Lösung.

## Produktziel

Die App soll eine zuverlässige persönliche Aufgaben-Zentrale sein. Sie soll schnell bedienbar, verständlich und stabil sein. Funktionsumfang ist zweitrangig gegenüber Alltagstauglichkeit.

## MVP-Muss-Funktionen

### Aufgabenverwaltung

- Aufgabe erstellen
- Aufgabe bearbeiten
- Aufgabe löschen
- Aufgabe als erledigt markieren
- erledigte Aufgabe wieder öffnen
- Status dauerhaft speichern

### Aufgabenfelder

- Titel
- Status
- Erstellungsdatum
- optionales Fälligkeitsdatum
- optionale Uhrzeit
- optionale Notiz
- optionale Priorität

### Ansichten

- Heute-Ansicht
- Kalenderansicht
- Inbox für Aufgaben ohne Datum
- einfache Gesamtübersicht oder Suche
- Mehr/Einstellungen für Backup und spätere Optionen

### Kalenderfunktionen

- Aufgabe einem Datum zuweisen
- Tagesliste für ausgewählten Kalendertag anzeigen
- Aufgabe auf anderes Datum verschieben
- Aufgaben ohne Datum separat anzeigen

### Offline und lokale Daten

- App funktioniert nach erstem Laden offline
- Aufgaben können offline erstellt, bearbeitet und erledigt werden
- Daten werden lokal gespeichert
- kein Login
- kein Backend
- keine externe Synchronisierung

### Backup

- JSON-Export aller lokalen Daten
- JSON-Import aus Backup-Datei
- Import schützt vor unbeabsichtigtem Datenverlust

## Soll-Funktionen

- Kategorien oder Listen
- Filter nach offen, erledigt, überfällig
- Prioritätsfilter
- Wiederkehrende Aufgaben
- Dark Mode
- einfache Einstellungen
- Bestätigungsdialog vor dauerhaftem Löschen
- Anzeige überfälliger Aufgaben in der Heute-Ansicht

## Kann-Funktionen

- lokale Erinnerungen
- Statistiken
- CSV-Export
- CSV-Import
- App-Icon und Splashscreen
- PIN-Sperre
- Schnellaktionen wie Morgen, Nächste Woche, Ohne Datum
- automatische Backup-Erinnerung
- KI-gestützte Aufgabenplanung

## Nicht-Ziele

- kein Benutzerkonto
- keine Cloud-Synchronisierung
- keine Teamfunktionen
- keine Freigabe an andere Nutzer
- keine native Android-App im ersten Schritt
- keine iOS-spezifische Entwicklung
- keine Projektmanagement-App
- kein Kanban-Board im MVP
- keine Server-Infrastruktur
- keine Google-/Outlook-/Todoist-Synchronisierung

## Akzeptanzkriterien MVP

Der MVP ist fachlich akzeptiert, wenn:

- Aufgaben lassen sich vollständig verwalten.
- Heute zeigt heutige und überfällige offene Aufgaben.
- Kalender zeigt Aufgaben am korrekten Datum.
- Inbox zeigt Aufgaben ohne Datum.
- lokale Daten bleiben nach Neustart erhalten.
- App ist nach erstem Laden offline nutzbar.
- JSON-Export und Import funktionieren.
- keine Cloud-, Login- oder Backend-Abhängigkeit existiert.
