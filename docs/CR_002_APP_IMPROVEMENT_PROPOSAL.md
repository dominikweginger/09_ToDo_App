# CR_002 App Improvement Proposal

Stand: 13.06.2026

## Grundlage

Analysiert wurden README, MASTER_BLUEPRINT, PRD, TECHNICAL_SPEC, IMPLEMENTATION_PLAN, TEST_PLAN, UI_SPEC, DATA_MODEL, DECISIONS und die React-/TypeScript-Code-Struktur.

Die App wurde lokal auf `http://127.0.0.1:5173/` gestartet und mit Playwright in einem mobilen Viewport `390x844` geprueft.

Gepruefte Flows:
- Dashboard leer und mit Aufgabe
- Aufgabe erstellen, Pflichtfeldvalidierung, Schnelldatum `Heute`, Markierung
- Geplant: `Liste`, `Woche`, `Kalender`
- Listenuebersicht und Liste erstellen
- Mehr: Backup, App-Info, Speicherdiagnose, Alle Aufgaben

Playwright-Artefakte liegen unter `output/playwright/`. Es wurden keine Console- oder Page-Errors beobachtet.

## UX-Bewertung

SoloTodo V2 ist fachlich bereits stabil und klar auf lokale, mobile Nutzung ausgelegt. Dashboard, Smart Views, echte Listen, Planung und Backup passen gut zum Produktziel.

Die groesste Reibung liegt nicht in fehlender Architektur, sondern in der Bedienverdichtung: Aufgabenkarte, Task-Formular und Planungsansicht zeigen viele Funktionen direkt auf engem Raum. Dadurch wird die App maechtiger, aber weniger schnell fuer den Hauptfall: unterwegs eine Aufgabe erfassen, heute planen und versehentliche Aktionen korrigieren.

## Problem

Normale Nutzer wollen meistens drei Dinge schnell erledigen:
- Aufgabe sofort erfassen
- heute oder demnaechst planen
- Fehler rueckgaengig machen

Aktuell sind diese Workflows moeglich, aber teils umstaendlich:
- Das Task-Formular zeigt sofort alle Felder und ist auf Mobile lang.
- Aufgabenkarte und Mehr-Ansicht zeigen viele Mikroaktionen direkt.
- `Verschieben` nutzt ein Date-Input pro Karte, was praezise, aber nicht schnell ist.
- Aufgaben ohne Datum sind nicht als eigener Aufraeum-Workflow sichtbar.
- Loeschen und Statuswechsel haben keine Undo-Logik.
- Listenanlage nutzt native Prompts statt einer konsistenten App-UI.

## Ziel

CR_002 soll SoloTodo schneller, fehlertoleranter und klarer machen, ohne die Architektur zu veraendern.

Ziele:
- weniger Reibung beim schnellen Erfassen
- bessere Tages- und Datumsplanung
- weniger sichtbare Komplexitaet auf Aufgabenkarte und Formular
- sichere Korrektur versehentlicher Aktionen
- weiterhin lokal, offline, mobile-first, ohne Backend, Login oder Cloud

## 20 Feature-Ideen

1. Kompakter Schnell-Erfassen-Modus: Titel zuerst, Details optional aufklappbar.
2. Aufgabenkarte vereinfachen: nur Status, Titel, Datum/Listenkontext und eine `Mehr`-Aktion direkt sichtbar.
3. Schnelles Verschieben per Chips: `Heute`, `Morgen`, `Naechste Woche`, `Ohne Datum`.
4. Undo-Toast fuer Loeschen, Abhaken, Markieren und Datumsaenderung.
5. Smart View `Ohne Datum` auf dem Dashboard, statt alter Inbox-Hauptnavigation.
6. Tagesansicht `Heute` verbessern: Ueberfaellig, Heute, Spaeter/Ohne Datum als klare Abschnitte.
7. Aufgaben ohne Datum gezielt einplanen: Aufraeumansicht mit Datum-Chips je Aufgabe.
8. Listen erstellen und umbenennen als Bottom Sheet statt Browser-Prompt.
9. Listenfarben im UI nutzbar machen: Farbauswahl beim Erstellen/Bearbeiten.
10. Leere Zustaende mit passender Primaeraktion, z. B. `Aufgabe fuer heute erstellen`.
11. Erledigte Aufgaben pro Ansicht einklappbar anzeigen.
12. Sortierung als Modus: Normalansicht ohne Pfeile, Sortiermodus mit Hoch/Runter-Aktionen.
13. Formularbereich `Wiederholung` erst nach Aufklappen anzeigen.
14. Formularbereich `Notiz` als optionaler Zusatzbereich anzeigen.
15. Prioritaet als Segmented-Control statt Select.
16. Statuswechsel mit kurzer Rueckmeldung, ob wiederkehrende Aufgabe verschoben wurde.
17. Geplant-Ansicht mit Abschnitt `Ueberfaellig`, damit alte Aufgaben nicht im Heute-Kontext untergehen.
18. Backup-Erinnerung lokal und manuell konfigurierbar, ohne Push und ohne Cloud.
19. Einfache lokale Suche in `Mehr` oder als Dashboard-Aktion.
20. Import-Vorschau vor Ersetzen: Anzahl Listen, Aufgaben, markierte und datierte Aufgaben.

## Beste 5 fuer den naechsten Entwicklungsschritt

### 1. Schnellerfassung mit optionalen Details

Warum:
Der wichtigste Workflow ist Aufgabe schnell erfassen. Das aktuelle Formular ist korrekt, aber zeigt auf Mobile sofort Titel, Notiz, Liste, Datum, Uhrzeit, Prioritaet, Status, Markierung und Wiederholung.

Konkrete Aenderungen:
- Task-Formular in zwei Ebenen aufteilen:
  - sichtbar: Titel, Schnelldatum, Liste, Speichern
  - optional: Notiz, Uhrzeit, Prioritaet, Status, Markiert, Wiederholung
- `Details anzeigen` als lokaler UI-State im Formular.
- Bestehende Felder und Datenmodell bleiben unveraendert.
- Beim Bearbeiten bestehender Aufgaben Details standardmaessig anzeigen, wenn optionale Felder befuellt sind.

Akzeptanzkriterien:
- Eine neue Aufgabe kann mit Titel und einem Tap auf Speichern erstellt werden.
- Schnelldatum bleibt ohne Scrollen erreichbar.
- Optionale Felder bleiben vollstaendig nutzbar.
- Bestehende Aufgaben werden ohne Datenverlust bearbeitet.

Tests:
- Component/Smoke-Test: Aufgabe nur mit Titel speichern.
- Component/Smoke-Test: Details oeffnen, Notiz/Prioritaet/Wiederholung speichern.
- Playwright-Smoke: Mobile Formular initial ohne Scrollfalle bedienbar.

Risiken:
- Optional versteckte Felder koennen schlechter auffindbar sein.
- Bearbeiten und Erstellen brauchen leicht unterschiedliche Initialzustaende.

Nicht-Ziele:
- Kein neues Datenmodell.
- Keine natuerliche Spracheingabe.
- Keine KI-Planung.

### 2. Aufgabenkarte entschlacken und Aktionen buendeln

Warum:
Die Aufgabenkarte ist funktional, wirkt auf Mobile aber aktionslastig. In `Geplant` und `Mehr` konkurrieren Date-Input, Markieren, Bearbeiten, Loeschen und Sortierung mit dem eigentlichen Lesen der Aufgabe.

Konkrete Aenderungen:
- Standardkarte zeigt nur Status, Titel, Datum/Uhrzeit, Liste, Prioritaet/Markierung/Wiederholung als Badges.
- Sekundaeraktionen in ein kleines Aktionsmenue oder Bottom Sheet verschieben.
- Sortierpfeile nur in Listen-Detailansicht und nur in einem expliziten Sortiermodus anzeigen.
- Date-Input nicht dauerhaft auf jeder Karte anzeigen.

Akzeptanzkriterien:
- Aufgabenliste ist auf 390px Breite ohne horizontale Enge lesbar.
- Bearbeiten, Loeschen, Markieren, Datum aendern bleiben erreichbar.
- Statuswechsel bleibt die schnellste direkte Aktion.
- Sortierung bleibt in Listendetails pruefbar.

Tests:
- Playwright-Smoke: Karte in Dashboard/Smart View/Listendetail oeffnen und Aktion aus Menue ausfuehren.
- Regression: Markieren, Bearbeiten, Loeschen, Sortieren funktionieren weiter.

Risiken:
- Ein Aktionsmenue fuegt einen Tap fuer seltene Aktionen hinzu.
- Fokus- und Tastaturbedienung des Menues muss sauber umgesetzt werden.

Nicht-Ziele:
- Kein Drag & Drop.
- Kein Kanban.
- Keine Desktop-spezifische Optimierung.

### 3. Schnellverschieben fuer Planung

Warum:
Planung ist Kernnutzen. Das Date-Input ist exakt, aber fuer typische Verschiebungen zu schwerfaellig.

Konkrete Aenderungen:
- Im Aktionsmenue oder in einer Verschieben-Aktion Chips anbieten:
  - Heute
  - Morgen
  - Naechste Woche
  - Ohne Datum
  - Datum waehlen
- Bestehende `moveTaskToDate`-Logik weiterverwenden.
- In `Geplant`, Kalender und Smart Views konsistent verfuegbar machen.

Akzeptanzkriterien:
- Eine Aufgabe kann mit maximal zwei Taps auf Morgen verschoben werden.
- `Ohne Datum` entfernt `dueDate` korrekt.
- Geplant-Zaehler und Kalender aktualisieren sich direkt.
- Keine externe Kalenderintegration entsteht.

Tests:
- Domain-Test fuer Datum entfernen und Datum setzen, falls noch nicht ausreichend abgedeckt.
- Playwright-Smoke: Aufgabe von Heute auf Morgen verschieben und in `Morgen` sehen.
- Playwright-Smoke: Aufgabe auf Ohne Datum setzen und aus Geplant entfernen.

Risiken:
- Chips muessen klare deutsche Labels haben und duerfen das UI nicht wieder ueberladen.
- Wochenlogik muss exakt zur bestehenden Montag-bis-Sonntag-Regel passen.

Nicht-Ziele:
- Kein Google-/Outlook-Kalender.
- Keine Push-Erinnerungen.
- Keine komplexe Wiederholungslogik.

### 4. Undo fuer riskante Aktionen

Warum:
Der Blueprint nennt versehentliches Loeschen und versehentliches Erledigen als Bedienfehler. Aktuell gibt es Toasts, aber keine Ruecknahme.

Konkrete Aenderungen:
- Undo-Toast nach:
  - Aufgabe loeschen
  - Aufgabe abhaken / wieder oeffnen
  - Datum aendern
  - Markierung aendern
- Undo speichert den vorherigen Task-Zustand lokal zurueck.
- Fuer Listenloeschung vorerst keine Undo-Funktion, weil mehrere Aufgaben betroffen sein koennen.

Akzeptanzkriterien:
- Nach Loeschen einer Aufgabe erscheint `Rueckgaengig`.
- Rueckgaengig stellt die Aufgabe inklusive Liste, Datum, Prioritaet, Markierung und Wiederholung wieder her.
- Toast ist auf Mobile nicht dauerhaft im Weg.
- Nach Ablauf bleibt der neue Zustand bestehen.

Tests:
- Unit-Test fuer Restore-Pfad im Handler oder Service.
- Playwright-Smoke: Aufgabe loeschen, Undo klicken, Aufgabe wieder sichtbar.
- Playwright-Smoke: Aufgabe erledigen, Undo klicken, Status wieder offen.

Risiken:
- Undo darf nicht mit parallel gespeicherten Aenderungen kollidieren.
- Toast-Position muss mit FAB und Bottom Navigation abgestimmt werden.

Nicht-Ziele:
- Kein globaler Versionsverlauf.
- Kein Papierkorb.
- Keine Synchronisationskonfliktlogik.

### 5. `Ohne Datum` als Aufraeumansicht

Warum:
Die alte Inbox ist laut CR_001 keine Hauptnavigation mehr. Trotzdem bleibt der Workflow wichtig: Aufgaben ohne Datum sammeln und spaeter einplanen.

Konkrete Aenderungen:
- Dashboard-Kachel `Ohne Datum` oder Bereich unter `Meine Listen` ergaenzen.
- Detailansicht zeigt offene Aufgaben ohne `dueDate`.
- Fokus auf schnelles Einplanen mit Chips aus Feature 3.
- Keine neue Hauptnavigation.

Akzeptanzkriterien:
- Aufgaben ohne Datum sind vom Dashboard aus direkt erreichbar.
- Die Ansicht zeigt nur offene, nicht archivierte Aufgaben ohne Datum.
- Jede Aufgabe kann aus dieser Ansicht schnell datiert oder erledigt werden.
- Sobald ein Datum gesetzt ist, verschwindet die Aufgabe aus `Ohne Datum`.

Tests:
- Smart-View-Service-Test fuer Aufgaben ohne Datum.
- Playwright-Smoke: Aufgabe ohne Datum erstellen, Kachelzaehler pruefen, auf Morgen einplanen.

Risiken:
- Dashboard kann mit sieben Kacheln voller wirken.
- Begriff `Ohne Datum` muss klar genug sein, um nicht wie ein Fehlerzustand zu wirken.

Nicht-Ziele:
- Keine Rueckkehr der alten Inbox als Hauptnavigation.
- Keine Tags oder komplexe Filter.
- Keine Suche in CR_002.

## Empfohlener CR_002-Zuschnitt

Empfohlene Reihenfolge:
1. Schnellerfassung mit optionalen Details
2. Aufgabenkarte entschlacken
3. Schnellverschieben
4. Undo fuer einzelne Aufgabenaktionen
5. `Ohne Datum` als Smart View

Dieser Zuschnitt bleibt MVP-orientiert, nutzt vorhandene Datenfelder und erhoeht den Alltagsnutzen ohne Backend, Login, Cloud oder neue Plattformabhaengigkeiten.

## Gesamt-Akzeptanzkriterien

- App bleibt eine reine React/Vite-PWA mit lokaler IndexedDB-Speicherung.
- Keine Backend-, Login-, Cloud- oder externe Kalenderabhaengigkeit wird eingefuehrt.
- Alle neuen UI-Flows funktionieren auf 390px Mobile-Viewport.
- Aufgaben koennen weiterhin erstellt, bearbeitet, geloescht, erledigt, markiert, datiert und Listen zugeordnet werden.
- Backup v2 bleibt kompatibel.
- Bestehende Tests laufen weiter.
- Neue oder geaenderte Logik ist durch fokussierte Tests abgedeckt.
- Playwright-Smoke deckt mindestens Schnell-Erfassung, Verschieben, Undo und `Ohne Datum` ab.

## Testplan fuer CR_002

Automatisiert:
- `npm test`
- `npm run build`
- Service-/Domain-Tests fuer `Ohne Datum`, Verschieben und Undo-Restore

Manuelle/Playwright-Smoke-Tests:
1. App auf Dashboard oeffnen.
2. Aufgabe nur mit Titel speichern.
3. Aufgabe mit Details speichern.
4. Aufgabe nach Morgen verschieben.
5. Aufgabe auf Ohne Datum setzen.
6. `Ohne Datum`-Ansicht oeffnen und Aufgabe einplanen.
7. Aufgabe loeschen und per Undo wiederherstellen.
8. Aufgabe erledigen und per Undo wieder oeffnen.
9. Listen-Detailansicht mit Sortiermodus pruefen.
10. Mehr-Ansicht und Speicherdiagnose pruefen.

## Risiken

- Zu viele Verbesserungen in einem CR koennen erneut gross werden. Umsetzung sollte in kleinen, pruefbaren Schritten erfolgen.
- Ein Aktionsmenue reduziert visuelle Dichte, kann aber wichtige Aktionen verstecken.
- Undo erfordert saubere Zustandsverwaltung, damit lokale Daten nicht inkonsistent werden.
- Eine weitere Dashboard-Kachel kann die Startseite ueberladen.
- Mobile Browser verhalten sich bei Date-Input, Fokus und virtueller Tastatur unterschiedlich.

## Nicht-Ziele

- Kein Backend
- Kein Login
- Keine Cloud-Synchronisierung
- Keine externe Kalenderintegration
- Keine Push Notifications
- Keine KI-Funktionen
- Keine Teamfunktionen
- Kein Kanban-Board
- Keine native Android- oder iOS-App
- Kein Dark Mode in CR_002
- Keine Suche in CR_002
- Keine Tags/Labels im UI
- Keine komplexe RRULE-Wiederholung
