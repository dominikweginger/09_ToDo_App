# `/goal`-Prompt für Codex – CR_003

> **Historischer, bereits ausgefuehrter Goal-Prompt.** CR_003 ist umgesetzt; diesen Block nicht erneut als aktuellen Auftrag verwenden. Siehe [`../../docs/CHANGELOG.md`](../../docs/CHANGELOG.md).

Kopiere ausschließlich den folgenden Block in Codex. Die vier CR-Dateien sollen im Repository vorhanden sein; `CR_003_COMPLETE_PACKAGE.md` wird bewusst nicht verwendet.

```text
/goal Implementiere CR_003 „Listentyp Checkliste und Sichtbarkeit undatierter Aufgaben“ vollständig im Repository `09_ToDo_App`.

VERBINDLICHE LESEFOLGE

Lies einmal vollständig:
1. `AGENTS.md`
2. `CR_003_CHANGE_REQUEST.md`
3. `CR_003_EXECUTION_SPEC.md`
4. `CR_003_TEST_REFERENCE.md`

Lies weitere Projektdokumente nur gezielt, wenn du sie gemäß Execution Spec aktualisierst oder zur Auflösung eines konkreten Widerspruchs benötigst. `CR_003_CHANGE_REQUEST.md` ist für Produktverhalten und Umfang autoritativ. `CR_003_EXECUTION_SPEC.md` legt die technische Umsetzung verbindlich fest. Der aktuelle Code ist für vorhandene Dateien und Signaturen maßgeblich.

AUSGANGSPUNKT

Erwarteter Base Commit: `e6549b7b7ed7b912fb987bb805d208caf1c53ded` auf `master`.

Falls HEAD abweicht, prüfe die betroffenen Bereiche gegen den aktuellen Code, setze den Change trotzdem vollständig um und dokumentiere relevante Abweichungen im Abschlussbericht. Stoppe nicht nach Analyse oder Planung und frage bei technisch lösbaren Detailabweichungen nicht nach.

VORGEHEN

1. Prüfe Git-Status und HEAD.
2. Suche repositoryweit nach allen `TodoList`-Objektliteralen und Fixtures sowie nach `createList`, `renameList`, `ensureDefaultList`, `ListFormSheet`, Rename-Modus, Rename-Callbacks und den sichtbaren Umbenennen-Texten.
3. Führe vor Änderungen `npm test` und `npm run build` aus. Falls `node_modules` fehlt, führe vorher `npm install` aus. Dokumentiere die Baseline.
4. Implementiere die Execution Spec in kleinen, fokussierten Schritten.
5. Verwende genau eine zentrale Domain-Funktion für die globale Checklisten-Sichtbarkeit. Dupliziere die Bedingung nicht in Views und ergänze sie nicht in `smart-view-service.ts`.
6. Verändere Task-Modell, Task-Persistenz, DB-Version, Stores, Indizes und Backup-Schemaversion nicht.
7. Erzwinge für `Allgemein` bei Erstellung, Laden, Normalisierung und Import immer `isChecklist: false`.
8. Wende den globalen Filter nur auf übergreifende Ansichten und Smart-View-Zähler an. Wende ihn niemals auf die eigene Listendetailansicht, Listenzähler, Backup-Anzahl oder Export an.
9. Der bisherige Exportumfang bleibt unverändert; undatierte Checklistenaufgaben müssen im Backup enthalten bleiben.
10. Passe alle typbedingt betroffenen Call-Sites und Test-Fixtures an, auch wenn deren Produktionscode fachlich unverändert bleibt.
11. Ergänze fokussierte, bevorzugt parametrisierte Tests gemäß Testreferenz. Erzeuge keine neue umfangreiche E2E-Infrastruktur.
12. Führe relevante Einzeltests, danach vollständig `npm test` und `npm run build` aus.
13. Führe verfügbare mobile, Persistenz- und Offline-Smoke-Tests durch. Behaupte nicht, nicht ausführbare Prüfungen durchgeführt zu haben.
14. Aktualisiere die in der Execution Spec genannten kanonischen Projektdokumente minimal und gezielt.
15. Prüfe abschließend jedes Akzeptanzkriterium aus dem Change Request.

HARTE GRENZEN

- kein neuer Aufgabentyp oder neue Task-Felder
- keine Mengen, Kategorien, Preise oder Einkaufsfunktionen
- keine neue Suche oder Navigation
- kein neuer Store, Index, DB-Upgrade oder Backup-Schema-Upgrade
- keine Erkennung anhand von Listennamen
- keine Task-Mutation oder Task-Schreibvorgänge allein wegen eines Listentypwechsels
- kein globaler Filter in Listendetail, Listenzählern oder Backup
- keine nicht angeforderten UX-Verbesserungen oder allgemeinen Refactorings

ABSCHLUSSBERICHT

Berichte kompakt:
- umgesetzte Lösung und zentrale Sichtbarkeitsregel,
- geänderte und neue Dateien,
- Baseline sowie finale Test- und Build-Ergebnisse,
- durchgeführte beziehungsweise nicht mögliche Smoke Tests,
- Bestätigung, dass keine Tasks migriert oder beim Listentypwechsel geschrieben wurden,
- Bestätigung, dass DB-Version und Backup-Schemaversion weiterhin `2` sind,
- Bestätigung, dass der bisherige Exportumfang erhalten blieb,
- Abweichungen vom erwarteten Base Commit oder Dateiplan,
- verbleibende Risiken; bei vollständiger Umsetzung ausdrücklich `keine`.
```
