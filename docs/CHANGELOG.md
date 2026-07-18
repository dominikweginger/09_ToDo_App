# Projektentwicklung und Change-Request-Index

Stand: 18.07.2026

## Kanonische Quellen

Fuer den aktuellen Stand gilt die in `AGENTS.md` festgelegte Prioritaet:

1. [`PRD.md`](../PRD.md) – geltender Produktumfang und Produktregeln
2. [`TECHNICAL_SPEC.md`](../TECHNICAL_SPEC.md) – aktuelle Architektur und Services
3. [`IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) – abgeschlossener Umsetzungsstand und Grenzen
4. [`TEST_PLAN.md`](../TEST_PLAN.md) – aktuelle automatisierte und manuelle Pruefung
5. [`README.md`](../README.md) – Einstieg, Setup und kompakter Ueberblick

Ergaenzend sind [`DATA_MODEL.md`](DATA_MODEL.md), [`UI_SPEC.md`](UI_SPEC.md) und [`DECISIONS.md`](DECISIONS.md) die kanonischen Detailreferenzen. Bei einem Widerspruch gilt die Prioritaet aus `AGENTS.md`; Code und Tests verifizieren den tatsaechlich implementierten technischen Stand.

## Projektursprung

- 09.06.2026: MVP als lokale, offlinefaehige Smartphone-PWA implementiert (`ecb23f6`).
- Urspruengliche Identitaet: Repository `dominikweginger/09_ToDo_App`, Projektordner `09_ToDo_App`, Arbeitstitel/Produktname `SoloTodo PWA`, npm-Paket-ID `solotodo-pwa`.
- [`master_blueprint.md`](../master_blueprint.md) dokumentiert die urspruengliche Idee und den damals vorgeschlagenen Umfang. Er ist historisch und nicht mehr die aktuelle Spezifikation.

## Change Requests

| CR | Status | Zeitlicher Stand | Ergebnis | Historische Quelle |
|---|---|---|---|---|
| CR_001 | **Umgesetzt** | vor CR_002; exaktes Abschlussdatum aus der Commitbezeichnung nicht sicher ableitbar | SoloTodo V2 mit Dashboard, echten Listen, sieben Smart Views, Planung/Woche/Kalender, erweitertem Task-Modell, Wiederholung und Backup v2. Spaetere CRs erweitern diesen Stand. | [`CR_001.md`](../CR_001/CR_001.md) |
| CR_002 | **Teilweise umgesetzt** | Commit `e6549b7`, 14.06.2026 | Umgesetzt sind kompakte Schnellerfassung, entschlackte Task-Karte mit Aktions-Sheet, Schnellverschieben, Smart View `Ohne Datum`, getrennte Heute-Darstellung und App-Sheet fuer Listen. Nicht umgesetzt ist insbesondere die vorgeschlagene Undo-Logik; weitere der 20 Ideen bleiben Vorschlaege. | [`CR_002_APP_IMPROVEMENT_PROPOSAL.md`](CR_002_APP_IMPROVEMENT_PROPOSAL.md) |
| CR_003 | **Umgesetzt** | Arbeitsbaum nach Base `e6549b7`; Abschluss/Verifikation 18.07.2026 | `TodoList.isChecklist`, geschuetzte Default-Liste, zentrale Sichtbarkeit undatierter Checklistenaufgaben, unveraenderte eigene Listen/Zaehler, Backup-v2-Kompatibilitaet. Keine Task-, DB- oder Backup-Schemamigration. | [`CR_003_CHANGE_REQUEST.md`](../Change_request/CR_003_Listenupdate_checkliste/CR_003_CHANGE_REQUEST.md) |

## CR_003 – verifizierter Ist-Stand

- `Allgemein` hat die feste ID `default-list`, ist nicht loesch- oder editierbar und wird stets mit `isChecklist: false` normalisiert.
- Nur ein echtes boolesches `true` aktiviert eine Checkliste.
- Undatierte Checklistenaufgaben werden in Dashboard-Smart-Zahlen, Smart-View-Details und `Alle Aufgaben` ausgeblendet.
- Datierte Checklistenaufgaben verhalten sich in globalen Ansichten normal.
- Eigene Listendetails und offene Listenzaehler bleiben vollstaendig.
- Export und Backup-Anzahl umfassen den nicht archivierten App-Bestand einschliesslich aller undatierten Checklistenaufgaben. Import bleibt Schema v2, normalisiert alte v2-Listen ohne Feld und ersetzt Tasks/Listen atomar erst nach Bestaetigung.
- IndexedDB bleibt `solotodo-db`, Version `2`, mit den Stores `tasks` und `lists`.
- Automatische Verifikation am 18.07.2026: 15 Testdateien / 68 Tests bestanden; `npm run build` erfolgreich.

Bekannte historische Abweichung: Die CR_003-Unterlagen sprechen teilweise von „allen Tasks“. Im realen UI-Flow uebergibt `App.tsx` an `SettingsView` und den Export bereits den Bestand ohne `status: archived`. CR_003 hat diesen vorbestehenden Exportumfang nicht erweitert; undatierte Checklistenaufgaben innerhalb dieses Bestands bleiben vollstaendig enthalten.

## Historische Unterlagen

- CR-Dokumente beschreiben die zum jeweiligen Zeitpunkt angeforderte Aenderung und werden nicht rueckwirkend in aktuelle Spezifikationen umgeschrieben.
- `CR_003_EXECUTION_SPEC.md`, `CR_003_TEST_REFERENCE.md` und `CR_003_GOAL_PROMPT.md` sind abgeschlossene historische Ausfuehrungsunterlagen.
- `CR_001/brain_dump.md`, `docs/PRODUCT_RESEARCH.md` und `docs/PROMPTS.md` sind Ideen-, Research- beziehungsweise Prompt-Unterlagen. Sie sind nicht normativ.
- `CONSISTENCY_CHECK.md` ist der aktuelle Dokumentationsabgleich; seine fruehere Vorimplementierungsbewertung wurde ersetzt.
