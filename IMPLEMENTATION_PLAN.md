# IMPLEMENTATION_PLAN.md

## Ziel

Dieses Dokument beschreibt den aktuellen Umsetzungsstand nach CR_001. Die Umsetzung erfolgte als Big-Bang-Change in kleinen technischen Teilbereichen.

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

## Verbleibende technische Detailentscheidungen

- `Allgemein` bleibt fix und nicht loeschbar.
- Manuelle Sortierung ist minimal ueber Hoch/Runter-Buttons umgesetzt.
- Die Kalenderansicht ist als Segment innerhalb von `Geplant` eingebunden.
- v1-Backups werden nicht importiert; CR_001 verlangt Schema-Version 2.
