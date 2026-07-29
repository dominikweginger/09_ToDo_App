# PRD.md

## Produktname

SoloTodo PWA

## Dokumentstatus und Kanonizitaet

Status: **aktuelle kanonische Produktspezifikation nach CR_005** (29.07.2026).

Bei Produktfragen ist dieses Dokument nach `AGENTS.md` massgeblich. Historische Anforderungen in `master_blueprint.md`, `CR_001/` und `Change_request/` erklaeren die Entstehung, ersetzen aber nicht diesen Ist-Stand.

## Produktbeschreibung

SoloTodo PWA ist eine private, lokal speichernde und offlinefaehige Aufgaben-Zentrale fuer eine einzelne Person. SoloTodo V2 strukturiert die App um Dashboard, zeitliche Planung, echte Listen und berechnete Smart Views; CR_003 ergaenzt Checklisten als Listeneigenschaft, CR_004 eine verlaessliche Ruecknavigation aus Listendetails und CR_005 eine direkte native Datumsauswahl im kompakten Aufgabenformular.

## Projektursprung

Das Projekt entstand im Repository `dominikweginger/09_ToDo_App` als schlanke, kalenderorientierte Offline-To-Do-PWA fuer die Smartphone-Nutzung. Der urspruengliche Arbeitstitel `SoloTodo PWA`, die lokale Speicherung, Einzelplatznutzung und der Verzicht auf Backend, Login und Cloud-Sync gelten fort. Der historische Ausgangsumfang ist in `master_blueprint.md` erhalten.

## Zielnutzer

Ein einzelner Nutzer, der Aufgaben am Smartphone schnell erfassen, in Listen ordnen, zeitlich planen und lokal sichern moechte.

## Produktziel CR_001

SoloTodo soll als neutrale, moderne "Apple Reminders light"-PWA funktionieren, ohne ein iOS-Klon zu sein. Die App bleibt lokal, offlinefaehig und backendlos.

## Kernfunktionen

- Dashboard als Startscreen
- Smart-View-Kacheln: Heute, Geplant, Diese Woche, Naechste Woche, Markiert, Dringend, Ohne Datum
- echte Listen als Aufgabencontainer
- Nutzerlisten koennen beim Erstellen und Bearbeiten als Checkliste markiert werden
- Default-Liste `Allgemein`
- Aufgaben liegen genau in einer Liste
- Geplant-Ansicht mit gruppierter Liste, Wochenuebersicht Montag bis Sonntag und Kalender
- bestehende Kalenderfunktion bleibt erhalten
- Aufgabe erstellen, bearbeiten, loeschen, abhaken und wieder oeffnen
- Markierung per `isFlagged`
- `priority: high` gilt als Dringend
- einfache Wiederholungen ohne RRULE
- manuelle Sortierung ueber `sortOrder`
- Backup-Export und bestaetigter atomarer Import mit Schema-Version 2

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
- Listen koennen erstellt, bearbeitet und geloescht werden.
- Jedes Listendetail bietet den sichtbaren, tastaturbedienbaren Button `Zurueck zu Listen`.
- Erneutes Tippen auf den Hauptnavigationseintrag `Listen` schliesst ein geoeffnetes Listendetail.
- Browser- beziehungsweise Android-Zurueck schliesst zuerst das Listendetail und zeigt die Listenuebersicht; ein Wechsel in einen anderen Hauptbereich bereinigt den Detail-History-Zustand.
- Eine undatierte Aufgabe in einer Checkliste erscheint nur in ihrer eigenen Liste und deren Listenzaehler; mit Datum verhaelt sie sich global normal.
- `Allgemein` ist nie eine Checkliste, auch nicht nach Laden oder Import.
- Der Checklistenstatus aendert keine Aufgabe und loest keine Task-Migration aus.
- Beim Loeschen einer nicht leeren Liste wird die Anzahl betroffener Aufgaben bestaetigt.
- Smart Views zeigen nur offene, nicht archivierte Aufgaben.
- `Ohne Datum` ist eine Smart View, keine Hauptnavigation.
- Das kompakte Aufgabenformular bietet `Heute`, `Morgen`, `Naechste Woche`, `Datum waehlen` und `Ohne Datum`; die Smart View `Diese Woche` bleibt davon unabhaengig erhalten.
- Dashboard-Smart-View-Zaehler verwenden dieselbe zentrale Checklisten-Sichtbarkeit wie die zugehoerigen Detailansichten.
- `Alle Aufgaben` blendet undatierte Checklistenaufgaben aus; Backup-Anzahl und Exportumfang bleiben gegenueber dem bisherigen nicht archivierten App-Bestand vollstaendig.
- Wiederkehrende Aufgaben bleiben beim Abhaken offen und erhalten das naechste Faelligkeitsdatum.
- Backup v2 enthaelt Tasks und Listen.
- Backup v2 enthaelt alle nicht archivierten Tasks einschliesslich undatierter Checklistenaufgaben; archivierte Records sind eine bekannte bestehende Export-Einschraenkung. `isChecklist` wird mit Listen roundtrip-faehig gespeichert und alte v2-Listen ohne Feld bleiben kompatibel.
- Keine Cloud-, Login- oder Backend-Abhaengigkeit existiert.
