# docs/PROMPTS.md

> **Nicht normative Prompt-Sammlung.** Die Beispiele sind Hilfsmittel fuer kuenftige Arbeiten und beschreiben keinen aktuellen Implementierungsauftrag. Aktuelle Regeln stehen in `../PRD.md`, `../TECHNICAL_SPEC.md` und `CHANGELOG.md`.

## Zweck

Dieses Dokument enthaelt nutzbare Prompts fuer Codex, um SoloTodo V2 zu pruefen und in spaeteren Changes kontrolliert weiterzuentwickeln.

## Prompt 1: Projekt pruefen

```text
Pruefe die vorhandenen Projektdokumente fuer SoloTodo PWA auf Konsistenz.

Beruecksichtige:
- MASTER_BLUEPRINT.md
- README.md
- PRD.md
- TECHNICAL_SPEC.md
- IMPLEMENTATION_PLAN.md
- TEST_PLAN.md
- AGENTS.md
- docs/UI_SPEC.md
- docs/DATA_MODEL.md
- docs/DECISIONS.md

Aufgaben:
1. Pruefe auf Widersprueche.
2. Pruefe, ob CR_001-Stand und Nicht-Ziele konsistent dokumentiert sind.
3. Pruefe, ob TECHNICAL_SPEC.md keine Cloud-, Login- oder Backend-Abhaengigkeit einfuehrt.
4. Pruefe, ob TEST_PLAN.md Listen, Smart Views, Wiederholungen, Backup v2 und Offline-Nutzung abdeckt.
5. Aendere keinen Code.
6. Gib eine strukturierte Liste mit Findings, Risiken und empfohlenen Dokumentaenderungen aus.
```

## Prompt 2: Regression pruefen

```text
Pruefe SoloTodo V2 gegen TEST_PLAN.md.

Scope:
- Dashboard
- Geplant mit Liste, Woche und Kalender
- Listen und Listendetail
- Smart Views
- Task-Formular
- Wiederholungen
- Backup v2
- lokale Persistenz
- Offline-Faehigkeit

Nicht umsetzen:
- kein Backend
- kein Login
- keine Cloud-Synchronisierung
- keine Suche
- kein Dark Mode
- keine externe Kalenderintegration

Fuehre relevante Tests, Build und einen Browser-Smoke-Test aus.
```

## Prompt 3: Kleinen Change umsetzen

```text
Setze den beschriebenen Change fuer SoloTodo PWA in kleinen, pruefbaren Schritten um.

Regeln:
- CR- oder Issue-Dokument ist primaere Scope-Quelle.
- Bestehende Architekturentscheidungen respektieren.
- Keine nicht angeforderten Features ergaenzen.
- Keine Cloud, kein Login, kein Backend.
- Lokale Speicherung und Offline-Faehigkeit erhalten.
- Nach Codeaenderungen relevante Tests, Build und Smoke-Test ausfuehren.
- Nur tatsaechlich veraltete Dokumentation aktualisieren.
- Wichtige technische Detailentscheidungen in docs/DECISIONS.md dokumentieren.
```

## Prompt 4: Backup und Datenmodell pruefen

```text
Pruefe Datenmodell und Backup von SoloTodo V2.

Erwartungen:
- IndexedDB nutzt Tasks und Listen.
- Jede Aufgabe hat eine gueltige listId.
- Allgemein existiert automatisch.
- Backup nutzt schemaVersion 2.
- Backup enthaelt tasks und lists.
- Import ersetzt Daten erst nach Bestaetigung.
- Ungueltige listId-Referenzen werden abgelehnt.

Fuehre npm test und npm run build aus.
```
