# AGENTS.md

## Dauerhafte Arbeitsregeln für Codex

1. Arbeite immer MVP-orientiert.
2. Verwende den MASTER_BLUEPRINT und die Projektdokumente als verbindliche Grundlage.
3. Baue kein Backend, keinen Login und keine Cloud-Synchronisierung ein.
4. Speichere Aufgaben lokal im Browserkontext.
5. Offline-Fähigkeit ist Kernanforderung, kein optionales Extra.
6. Halte UI und Code mobile-first.
7. Ergänze keine nicht angeforderten Features.
8. Markiere offene Entscheidungen als TODO oder Offene Entscheidung.
9. Ändere Architekturentscheidungen nicht stillschweigend.
10. Implementiere in kleinen, prüfbaren Schritten.
11. Nach jeder größeren Änderung: relevante Tests oder Smoke Tests prüfen.
12. Dokumentiere wichtige Entscheidungen in `docs/DECISIONS.md`.

## Priorität

Bei Widersprüchen gilt:

1. PRD.md
2. TECHNICAL_SPEC.md
3. IMPLEMENTATION_PLAN.md
4. TEST_PLAN.md
5. README.md

## Nicht automatisch umsetzen

Ohne ausdrückliche Entscheidung nicht umsetzen:

- Cloud-Sync
- Login
- Backend
- native Android-App
- iOS-App
- externe Kalenderintegration
- KI-Funktionen
- Teamfunktionen
- Kanban-Board
