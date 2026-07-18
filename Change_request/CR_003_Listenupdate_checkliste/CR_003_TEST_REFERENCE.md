# CR_003 – Kompakte Testreferenz

> **Historische Testunterlage zu CR_003.** Die Umsetzung wurde am 18.07.2026 mit 15 Testdateien / 68 bestandenen Tests und erfolgreichem Build verifiziert. Der aktuelle Testplan steht in [`../../TEST_PLAN.md`](../../TEST_PLAN.md); nicht ausgefuehrte manuelle Smokes werden nicht als bestanden behauptet.

## 1. Ziel

Diese Referenz definiert die erforderliche Testabdeckung für CR_003. Sie ist kein Auftrag, für jeden Tabellenpunkt einen eigenen Test anzulegen.

Codex soll zusammengehörige Fälle bevorzugt tabellengetrieben oder parametrisiert abdecken. Qualität wird an der fachlichen Abdeckung gemessen, nicht an der Anzahl der Testfälle.

## 2. Pflichtprüfungen

Vor der Änderung und nach der vollständigen Umsetzung:

```bash
npm test
npm run build
```

Zusätzlich relevante Einzeltests während der Implementierung ausführen. Vorhandene Playwright- oder Browser-Smoke-Möglichkeiten verwenden, aber keine neue umfangreiche E2E-Infrastruktur nur für CR_003 einführen.

## 3. Einheitliche Testdaten

Mindestens verwenden:

- normale Liste mit `isChecklist: false`
- Checkliste mit `isChecklist: true`
- Default-Liste mit `isChecklist: false`
- mehrere Checklisten mit unterschiedlichen IDs und Namen
- gespeicherte/importierte Liste ohne Feld
- gespeicherte/importierte Liste mit ungültigen Werten wie `null`, String `"true"` oder Zahl `1`
- Aufgabe mit unbekannter Listen-ID

Bestehende Listen-Fixtures im Repository um das neue Pflichtfeld ergänzen.

## 4. Domain-Abdeckung

### 4.1 Listenmodell und Listenservice

Abdecken:

1. `createDefaultList()` erzeugt weiterhin ID `default-list`, Name `Allgemein` und `isChecklist: false`.
2. `createList` trimmt den Namen und übernimmt `false` beziehungsweise `true` korrekt.
3. `updateList` erhält ID, Farbe und `createdAt`, aktualisiert Name, `isChecklist` und `updatedAt`.
4. Die Default-Liste wird durch `updateList` nicht verändert.
5. Fehlendes oder ungültiges `isChecklist` wird zu `false`.
6. Nur echtes boolesches `true` bleibt `true`.
7. `ensureDefaultList` normalisiert alle Listen und erzwingt für `default-list` immer `false`.
8. Normalisierung verändert keine sonstigen gültigen Listendaten.

### 4.2 Visibility-Service

Die folgende Matrix vollständig abdecken:

| Liste | Datum | Status/Merkmale | Erwartung im global zulässigen Bestand |
|---|---|---|---|
| normal | keines | offen | enthalten |
| normal | vorhanden | offen | enthalten |
| Checkliste | keines | offen | nicht enthalten |
| Checkliste | vorhanden | offen | enthalten |
| Checkliste | keines | erledigt | nicht enthalten |
| Checkliste | keines | markiert | nicht enthalten |
| Checkliste | keines | Priorität hoch | nicht enthalten |
| Checkliste | vorhanden | markiert oder dringend | enthalten |
| unbekannte Listen-ID | keines | beliebig | enthalten |

Zusätzlich prüfen:

- mehrere Checklisten werden unabhängig behandelt,
- leere Arrays funktionieren,
- Eingabearrays und Objekte werden nicht mutiert,
- der Service trifft keine eigene Status- oder Sortierentscheidung.

## 5. Listenformular

Bestehende Tests erweitern oder ersetzen, sodass mindestens abgedeckt ist:

1. Create-Modus: Name leer, Checkbox nicht aktiviert.
2. Speichern einer normalen Liste liefert getrimmten Namen und `isChecklist: false`.
3. Speichern einer Checkliste liefert `isChecklist: true`.
4. Edit-Modus: Überschrift `Liste bearbeiten`, Name und Status vorausgefüllt.
5. Eine bestehende Checkliste kann deaktiviert werden.
6. Namenspflicht und bestehende Fehlermeldung bleiben erhalten.
7. Hilfetext wird angezeigt.
8. Checkbox ist über den sichtbaren Text `Checkliste` barrierearm auffindbar.

## 6. View- und Integrationstests

### 6.1 Dashboard

Mindestens prüfen:

- Zwei offene undatierte Checklistenaufgaben ergeben im Listenzähler weiterhin `2`.
- Dieselben Aufgaben erhöhen `Ohne Datum`, `Markiert` oder `Dringend` nicht.
- Eine normale undatierte Aufgabe wird weiterhin gezählt.
- Eine datierte Checklistenaufgabe zählt in den zutreffenden Smart Views normal.
- Mehrere Checklisten funktionieren unabhängig.

### 6.2 Smart-View-Detail

Mindestens prüfen:

- `Ohne Datum` rendert normale undatierte Aufgaben, aber keine undatierten Checklistenaufgaben.
- `Markiert` und `Dringend` blenden undatierte Checklistenaufgaben aus.
- Datierte markierte oder dringende Checklistenaufgaben werden gerendert.
- `Heute` behandelt datierte heutige und überfällige Checklistenaufgaben wie normale Tasks.
- Wenn ausschließlich ausgeblendete Tasks vorhanden sind, bleibt der bestehende Empty State korrekt.

### 6.3 `Alle Aufgaben`

Mindestens prüfen:

- offene und erledigte undatierte Checklistenaufgaben werden nicht angezeigt,
- datierte Checklistenaufgaben werden nach bestehenden Regeln angezeigt,
- normale undatierte Aufgaben bleiben sichtbar,
- angezeigte Backup-Anzahl bleibt ungekürzt,
- der Exportcallback wird nicht durch den globalen Filter ersetzt.

### 6.4 Eigene Listendetailansicht

Durch vorhandene Tests oder einen fokussierten Regressionstest absichern:

- offene, erledigte und markierte undatierte Checklistenaufgaben bleiben in ihrer Liste sichtbar,
- Sortierung, Abhaken, Wiederöffnen, Bearbeiten und Löschen bleiben unverändert.

## 7. Dynamische React-State-Fälle

Die unmittelbare Reaktion soll durch geeignete Component-/Integrationstests oder durch einen nachvollziehbaren Smoke Test belegt werden:

- Datum setzen: Aufgabe wird global sichtbar.
- Datum entfernen: undatierte Checklistenaufgabe wird global ausgeblendet.
- normale Liste zu Checkliste: globale Ansichten und Zähler aktualisieren sich.
- Checkliste zu normaler Liste: globale Sichtbarkeit kehrt zurück.
- Task in Checkliste verschieben und wieder heraus verschieben: Verhalten folgt sofort der aktuellen Liste.

Ein End-to-End-Test aller fünf Fälle ist nicht erforderlich, wenn Domain- und View-Tests die Datenabhängigkeit eindeutig belegen und der React-State-Smoke erfolgreich ist.

## 8. Backup und Persistenz

Mindestens abdecken:

1. `BACKUP_SCHEMA_VERSION` bleibt `2`.
2. Neues Backup enthält `isChecklist` in Listen.
3. Roundtrip erhält `true` und `false`.
4. Altes v2-Backup ohne Feld importiert die Liste als normal.
5. Ungültiger Feldwert wird `false`.
6. Import mit `default-list: true` ergibt `default-list: false`.
7. Undatierte Checklistenaufgaben bleiben im Backup enthalten.
8. Der bisherige Exportumfang wird nicht durch den neuen Filter verändert.
9. Bestehende Prüfung unbekannter `listId`-Referenzen bleibt erfolgreich.
10. DB-Version und Stores bleiben unverändert.

Persistenz-Smoke:

- Checkliste erstellen und Aufgabe ohne Datum anlegen.
- App neu laden beziehungsweise Daten erneut aus IndexedDB lesen.
- Checklistenstatus und Aufgabe bleiben vorhanden.
- Aufgabe ist in ihrer Liste sichtbar und global ausgeblendet.

## 9. Mobile- und Offline-Smoke

Soweit die Umgebung dies zulässt:

1. Listenformular im mobilen Viewport öffnen.
2. Checkbox und Hilfetext ohne Layoutfehler bedienen.
3. Checkliste erstellen und bearbeiten.
4. undatierte Aufgabe in der Checkliste anlegen.
5. eigene Liste, Dashboard, `Ohne Datum`, `Markiert`, `Dringend` und `Alle Aufgaben` prüfen.
6. Datum setzen und globale Sichtbarkeit prüfen.
7. Datum entfernen und erneutes Ausblenden prüfen.
8. App nach vorherigem Laden offline öffnen und Kernverhalten erneut prüfen.
9. auf Konsolen- und Page-Errors achten.

Nicht technisch ausführbare manuelle Prüfungen im Abschlussbericht ausdrücklich nennen und nicht als erfolgreich behaupten.

## 10. Verbotene Nebenwirkungen

Tests oder Code-Review müssen bestätigen:

- kein neues Task-Feld,
- kein neuer Store oder Index,
- keine DB-Versionsänderung,
- keine Backup-Schemaerhöhung,
- keine Namensheuristik,
- keine Task-Mutation beim Wechsel des Listentyps,
- kein Checklistenfilter in Listendetail oder Listenzähler,
- kein Checklistenfilter im Backup-Export,
- keine Checklisten-Sonderlogik in `smart-view-service.ts`,
- keine nicht angeforderten Features oder allgemeinen Refactorings.

## 11. Akzeptanz-Traceability

| Produktkriterium | Primäre Abdeckung |
|---|---|
| Erstellung und Bearbeitung | Listenservice + Formular |
| undatierte Checklistenaufgabe global ausblenden | Visibility-Service + Dashboard + Smart Views + Alle Aufgaben |
| datierte Aufgabe normal behandeln | Visibility-Service + Smart Views |
| eigene Liste und Listenzähler vollständig | Dashboard/ListsView + Listendetail-Regression |
| sofortige Änderungen | React-State-/Integration-Smoke |
| mehrere Checklisten und unbekannte Liste | Visibility-Service |
| bestehende Daten und Default-Liste | Normalisierung + Backup |
| Backup vollständig und v2-kompatibel | Backup-Tests |
| keine Regression | vollständige Tests, Build und Smoke |
