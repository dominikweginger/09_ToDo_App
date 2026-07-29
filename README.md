# SoloTodo PWA

SoloTodo ist eine mobile-first To-Do-PWA fuer eine einzelne Person. Aufgaben und Listen werden ausschliesslich lokal im Browser in IndexedDB gespeichert. Nach dem ersten erfolgreichen Laden ist die App offline nutzbar; Backend, Login und Cloud-Synchronisierung sind bewusst nicht vorgesehen.

## Aktueller Stand

Status: **SoloTodo V2, CR_001 bis CR_006 umgesetzt** (Dokumentationsstand 29.07.2026).

- Hauptnavigation: `Dashboard | Geplant | Listen | Mehr`
- sieben Smart Views: Heute, Geplant, Diese Woche, Naechste Woche, Markiert, Dringend und Ohne Datum
- echte Listen mit fixer Default-Liste `Allgemein`
- verlaessliche Ruecknavigation aus Listendetails ueber sichtbaren Button, erneutes Tippen auf `Listen` und Browser-/Android-Zurueck
- optionale Checklisten: undatierte Aufgaben sind nur in der eigenen Checkliste und deren Zaehlern sichtbar; sobald sie ein Datum haben, gelten die normalen globalen Regeln
- Aufgaben mit Liste, Datum, Uhrzeit, Prioritaet, Markierung, Notiz, Status, manueller Sortierung und einfacher Wiederholung
- kompaktes Aufgabenformular mit Schnelldaten, eindeutig sichtbarer aktiver Datumsauswahl und direktem nativen Date Picker
- Geplant-Ansicht mit gruppierter Liste, Wochenuebersicht und Kalender
- JSON-Backup/Import mit Schema v2 fuer nicht archivierte Tasks und alle Listen
- PWA-App-Shell und sichtbarer Update-Hinweis
- lokale Speicherdiagnose ohne Ausgabe von Aufgabeninhalten

Die vollstaendigen geltenden Produktregeln stehen in [PRD.md](PRD.md), der technische Ist-Stand in [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md). Datenmodell und UI sind in [docs/DATA_MODEL.md](docs/DATA_MODEL.md) und [docs/UI_SPEC.md](docs/UI_SPEC.md) beschrieben. Entwicklung und CR-Status stehen in [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Projektursprung und Identitaet

Das Repository wurde als persoenliche, kalenderorientierte Offline-To-Do-App fuer die Smartphone-Nutzung angelegt. Der urspruengliche Projektordner und die Repository-ID lauten `09_ToDo_App`; das dokumentierte Remote-Repository lautet `dominikweginger/09_ToDo_App`. Der Arbeitstitel und heutige Produktname sind `SoloTodo PWA`, die npm-Paket-ID ist `solotodo-pwa`, der PWA-Kurzname `SoloTodo` und die lokale IndexedDB-ID `solotodo-db`.

Der urspruengliche, vor der Umsetzung entstandene Umfang ist unveraendert in [master_blueprint.md](master_blueprint.md) erhalten. Er ist eine historische Ursprungsspezifikation und beschreibt nicht den heutigen Funktionsumfang.

## Setup und Pruefung

Voraussetzung: Node.js mit npm.

```bash
npm install
npm run dev
```

Der Entwicklungsserver bindet an `http://127.0.0.1:5173` (oder den naechsten freien Vite-Port).

```bash
npm test
npm run build
npm run preview
```

`npm test` fuehrt die Vitest-Suite aus. `npm run build` prueft TypeScript mit `tsc --noEmit` und erzeugt danach den Vite/PWA-Produktionsbuild.

## Backup und lokale Daten

- Exportiert werden alle nicht archivierten Tasks im App-Bestand und alle Listen, insbesondere auch undatierte Checklistenaufgaben. Bereits archivierte Records werden vom aktuellen App-Handler nicht an den Export uebergeben.
- Import akzeptiert ausschliesslich Backup-Schema v2, validiert Tasks, Listen und `listId`-Referenzen und ersetzt die lokalen Daten erst nach Bestaetigung atomar.
- Alte v2-Listen ohne `isChecklist` bleiben kompatibel und werden als normale Listen geladen.
- `Allgemein` wird bei Laden und Import sichergestellt und kann weder geloescht noch als Checkliste markiert werden.
- Browserdaten sind die einzige primaere Datenquelle. Vor dem Entfernen einer installierten PWA oder dem Loeschen von Browserdaten sollte ein Backup exportiert werden.

## Installierte PWA aktualisieren

Beim Start und beim Zurueckkehren in den Vordergrund prueft die App auf eine neue App-Shell. Der Hinweis `Neue Version verfuegbar. Neu laden.` aktiviert sie. Falls weiterhin eine alte Version erscheint: App vollstaendig schliessen, die App-URL im Browser neu laden und erst als letzte Massnahme die PWA entfernen und neu installieren. Lokale Daten vorher sichern.

## Nicht-Ziele und bekannte Einschraenkungen

- kein Backend, Login oder Cloud-Sync
- keine externe Kalenderintegration, Push Notifications oder nativen Apps
- keine KI-, Team-, Freigabe- oder Kanban-Funktionen
- keine Suche, kein Dark Mode, keine komplexe RRULE-Engine
- kein harter Zugriffsschutz; lokale Daten koennen durch Browserdaten-Loeschung verloren gehen
- Offline-Nutzung setzt voraus, dass die App-Shell zuvor erfolgreich geladen wurde
- der UI-Backup-Export schliesst archivierte Task-Records nicht ein

## Kanonische Dokumente

Die kuenftig massgeblichen Quellen und ihre Prioritaet sind in [PRD.md](PRD.md) und [docs/CHANGELOG.md](docs/CHANGELOG.md) festgelegt. Change Requests, Execution Specs, Testreferenzen, Goal-Prompts, Brain Dumps, Research- und Blueprint-Dateien sind historische Unterlagen; sie aendern den aktuellen Stand nicht rueckwirkend.
