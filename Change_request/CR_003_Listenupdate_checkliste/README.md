# CR_003 Codex Package

**Status: abgeschlossen / historisches Paket (18.07.2026).** Die vier Ausfuehrungsdateien bleiben zur Nachvollziehbarkeit erhalten. Die nachfolgende Verwendung beschreibt den damaligen Ablauf und ist keine aktuelle Handlungsanweisung. Der heutige Stand steht in [`../../docs/CHANGELOG.md`](../../docs/CHANGELOG.md).

## Verwendung

1. Lege die vier `CR_003_*.md`-Dateien im Root von `09_ToDo_App` ab.
2. Verwende den Block aus `CR_003_GOAL_PROMPT.md` als einzigen `/goal`-Auftrag.
3. Ein zusätzliches monolithisches Komplettpaket ist bewusst nicht enthalten, um doppelten Kontext und unnötige Tokens zu vermeiden.

## Dateien

- `CR_003_CHANGE_REQUEST.md` – fachliche Quelle und Akzeptanzkriterien
- `CR_003_EXECUTION_SPEC.md` – eindeutige technische Umsetzung
- `CR_003_TEST_REFERENCE.md` – kompakte, parametrisierbare Testabdeckung
- `CR_003_GOAL_PROMPT.md` – ausführbarer Codex-Auftrag

## Wichtiger Ausgangspunkt

Erwarteter Base Commit: `e6549b7b7ed7b912fb987bb805d208caf1c53ded`.
