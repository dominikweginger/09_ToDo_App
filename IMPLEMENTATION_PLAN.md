# IMPLEMENTATION_PLAN.md

## Ziel

Dieses Dokument beschreibt den abgeschlossenen Umsetzungsstand von SoloTodo V2 bis CR_004. Es ist kein Zukunftsplan. Neue Vorhaben benoetigen einen eigenen Change Request und duerfen die geltenden Entscheidungen nicht stillschweigend aendern.

## Abgeschlossen mit CR_001

1. Feature-Branch fuer den Change erstellt.
2. Task-Modell um `listId`, `isFlagged`, `recurrence` und `sortOrder` erweitert.
3. Listenmodell mit Default-Liste `Allgemein` ergaenzt.
4. IndexedDB auf Version 2 mit `tasks`- und `lists`-Store erweitert.
5. Listen-Repository und Listen-Domain-Service ergaenzt.
6. Smart-View-Service fuer Heute, Geplant, Diese Woche, Naechste Woche, Markiert und Dringend ergaenzt.
7. Wiederholungsservice fuer taeglich, woechentlich, monatlich, jaehrlich und Intervallvarianten ergaenzt.
8. App-State und Handler fuer Listen, Smart Views, Wiederholungen, Markierung und Sortierung umgebaut.
9. Hauptnavigation auf `Dashboard | Geplant | Listen | Mehr` geaendert.
10. Dashboard, Geplant, Listen, Listendetail und Smart-View-Detail ergaenzt.
11. Kalenderansicht in `Geplant` integriert und fachlich erhalten.
12. Task-Formular um Liste, Markierung, Wiederholung und Quick Actions erweitert.
13. Task-Karten um Liste, Markierung, Wiederholung und Sortieraktionen erweitert.
14. Backup-Schema auf v2 fuer Tasks und Listen umgebaut.
15. Tests fuer Domain-Logik, Wiederholungen und Backup v2 aktualisiert.
16. Service-Worker-Cache-Version erhoeht.
17. Projektdokumentation an den neuen Stand angepasst.

## Abgeschlossen mit CR_003

1. `TodoList` um das normalisierte Pflichtfeld `isChecklist` und das Formularobjekt `ListDraft` erweitert.
2. Listenerstellung und -bearbeitung einschliesslich Schutz der Default-Liste umgesetzt.
3. Eine zentrale Sichtbarkeitsfunktion fuer undatierte Checklistenaufgaben eingefuehrt.
4. Dashboard-Smart-Zaehlung, Smart-View-Details und `Alle Aufgaben` angebunden; eigene Listen und Listenzaehler unveraendert gelassen.
5. Persistenz und Backup v2 rueckwaertskompatibel normalisiert, ohne DB- oder Backup-Schemamigration.
6. Fokussierte Domain-, Formular-, View-, Persistenz- und Backup-Regressionstests ergaenzt.

## Change-Request-Status

- `CR_001`: **Umgesetzt**; SoloTodo V2 mit Dashboard, Listen, Smart Views, Planung, Wiederholung und Backup v2.
- `CR_002`: **Teilweise umgesetzt**; die umgesetzten UX-Verbesserungen sind im Changelog einzeln benannt, nicht umgesetzte Ideen bleiben Vorschlaege.
- `CR_003`: **Umgesetzt** am 18.07.2026; Checklistenmetadatum, zentrale Sichtbarkeit und kompatibles Backupverhalten.
- `CR_004`: **Umgesetzt** am 29.07.2026; drei konsistente Rueckwege aus Listendetails mit leichtem History-State und ohne Router- oder Datenmigration.

Siehe `docs/CHANGELOG.md` fuer die kanonische Historie und Verweise.

## Nicht umgesetzt, weil explizit nicht im Scope

- Backend
- Login
- Cloud-Sync
- externe Kalenderintegration
- Suche
- Dark Mode
- Drag & Drop
- komplexe RRULE-Engine
- native Apps
- KI-Funktionen
- Teamfunktionen

## Pruefschritte

- `npm test`
- `npm run build`
- Browser-Smoke-Test auf `http://127.0.0.1:5173`

Letzte dokumentierte automatische Pruefung am 29.07.2026: `npm test` mit 16 Testdateien und 74 bestandenen Tests; `npm run build` einschliesslich PWA-Service-Worker erfolgreich. Ein Chromium-Smoke gegen den Produktionsbuild bei `390 x 844` deckte die CR_004-Rueckwege, History-Bereinigung, Kernaktionen, Konsole und Offline-Neuladen ab; ein physischer Android-Test wurde nicht ausgefuehrt.

## Verbleibende technische Detailentscheidungen

- `Allgemein` bleibt fix und nicht loeschbar.
- Manuelle Sortierung ist minimal ueber Hoch/Runter-Buttons umgesetzt.
- Die Kalenderansicht ist als Segment innerhalb von `Geplant` eingebunden.
- v1-Backups werden nicht importiert; CR_001 verlangt Schema-Version 2.
