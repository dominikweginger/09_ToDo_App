# CR_003 – Listentyp „Checkliste“ und Sichtbarkeit undatierter Aufgaben

**Aktueller Status: Umgesetzt und am 18.07.2026 automatisch verifiziert.** Ergebnis: Checklistenmetadatum, zentrale globale Sichtbarkeit, geschuetzte Default-Liste und kompatibles Backup v2 sind implementiert. Keine Task-, Datenbank- oder Backup-Schemamigration. Kanonischer Ist-Stand: [`../../docs/CHANGELOG.md`](../../docs/CHANGELOG.md), [`../../PRD.md`](../../PRD.md) und [`../../TECHNICAL_SPEC.md`](../../TECHNICAL_SPEC.md). Der folgende Inhalt bleibt als urspruengliche Anforderung erhalten.

## 1. Dokumentstatus

- **Repository:** `dominikweginger/09_ToDo_App`
- **Erwarteter Ausgangsstand:** `master`, Commit `e6549b7b7ed7b912fb987bb805d208caf1c53ded`
- **Produkt:** SoloTodo PWA
- **Change Request:** `CR_003`
- **Urspruenglicher Status:** zur Umsetzung freigegeben
- **Priorität:** mittel
- **Risiko:** niedrig bis mittel

Falls der tatsächliche HEAD vom erwarteten Ausgangsstand abweicht, bleibt dieses Dokument für das gewünschte Produktverhalten verbindlich. Der aktuelle Code ist für vorhandene Dateien, Signaturen und technische Detailstrukturen maßgeblich.

## 2. Autorität und Dokumente

Für CR_003 gilt folgende Reihenfolge:

1. `CR_003_CHANGE_REQUEST.md` für Produktverhalten, Umfang und Akzeptanzkriterien
2. `CR_003_EXECUTION_SPEC.md` für die technische Umsetzung
3. `CR_003_TEST_REFERENCE.md` für die erforderliche Testabdeckung
4. `AGENTS.md` für allgemeine Projektregeln
5. bestehende kanonische Projektdokumente gemäß `AGENTS.md`

CR_003 überschreibt bestehende Entscheidungen ausschließlich hinsichtlich der neuen Listeneigenschaft `Checkliste` und der daraus folgenden Sichtbarkeit undatierter Aufgaben. Alle übrigen Produkt- und Architekturentscheidungen bleiben unverändert.

## 3. Ausgangssituation

SoloTodo besitzt normale Aufgaben, echte Listen, berechnete Smart Views, eine Ansicht `Alle Aufgaben` und Listendetailansichten mit `Offen`, `Erledigt` und `Markiert`.

Jede Aufgabe gehört über `listId` genau einer Liste. Listen unterscheiden sich aktuell über ID, Name, Farbe und Zeitstempel.

Undatierte Aufgaben einer als Einkaufsliste verwendeten Liste erscheinen derzeit zusätzlich in übergreifenden Ansichten wie `Ohne Datum`, `Markiert`, `Dringend` und `Alle Aufgaben`. Das erzeugt eine unerwünschte Mehrfachsichtbarkeit, obwohl nur ein Datensatz existiert.

## 4. Ziel

Listen erhalten die boolesche Eigenschaft **Checkliste**.

Beim Erstellen und Bearbeiten einer Nutzerliste kann festgelegt werden, ob sie eine Checkliste ist. Aufgaben in einer Checkliste bleiben vollständig normale Aufgaben.

Die einzige neue fachliche Regel lautet:

> Eine Aufgabe ohne Fälligkeitsdatum, die einer Checkliste zugeordnet ist, wird außerhalb ihrer eigenen Liste nicht angezeigt.

Sobald die Aufgabe ein Fälligkeitsdatum besitzt, verhält sie sich global vollständig wie eine normale Aufgabe.

## 5. Verbindliche Produktregeln

### 5.1 Aufgabenmodell bleibt unverändert

CR_003 führt weder einen Einkaufsartikel noch einen neuen Aufgabentyp ein. Nicht verändert werden:

- Task-Datenmodell und Task-Backupstruktur
- Aufgabenerstellung und Aufgabenformular
- Aufgabenkarten und Statuswechsel
- Abhaken und Wiederöffnen
- Priorität und Markierung
- Wiederholung, Notiz, Datum und Uhrzeit
- Sortierung, Löschen und Wiederherstellung

### 5.2 Listeneigenschaft

Jede Liste besitzt künftig `isChecklist` als booleschen Wert.

- `false`: normale Aufgabenliste
- `true`: Checkliste
- fehlend oder ungültig: wie `false` behandeln

Nur der echte boolesche Wert `true` aktiviert das Checklistenverhalten.

Die Default-Liste `Allgemein` ist immer eine normale Aufgabenliste. Sie darf weder über die UI noch durch Laden, Import oder Normalisierung zu einer Checkliste werden.

### 5.3 Wahrheitstabelle

| Liste | Aufgabe hat Fälligkeitsdatum | Verhalten außerhalb der eigenen Liste |
|---|---:|---|
| normale Liste | nein | bisheriges Verhalten |
| normale Liste | ja | bisheriges Verhalten |
| Checkliste | nein | ausblenden |
| Checkliste | ja | vollständig normales Verhalten |

### 5.4 Bedeutung „außerhalb der eigenen Liste“

Undatierte Aufgaben aus Checklisten dürfen nicht erscheinen in:

- `Ohne Datum`
- `Markiert`
- `Dringend`
- weiteren übergreifenden Smart Views, sofern deren bestehende Logik undatierte Aufgaben grundsätzlich zulässt
- `Alle Aufgaben`
- den zugehörigen Smart-View-Zählern auf dem Dashboard

Sie bleiben sichtbar und funktionsfähig in:

- ihrer eigenen Listendetailansicht
- `Offen`, `Erledigt` und `Markiert` innerhalb dieser Liste
- der Listenübersicht
- `Meine Listen` auf dem Dashboard
- der offenen Aufgabenanzahl ihrer Liste
- Persistenz, Backup, Import und Export im bisherigen Umfang

### 5.5 Datierte Checklistenaufgaben

Eine datierte Aufgabe einer Checkliste wird nicht durch CR_003 eingeschränkt. Sie erscheint nach den bereits bestehenden Regeln beispielsweise in:

- `Heute`
- `Geplant`
- Wochenansicht und Kalender
- `Markiert`, falls markiert
- `Dringend`, falls Priorität hoch
- `Alle Aufgaben`

CR_003 setzt kein Datum automatisch.

## 6. Benutzeroberfläche

### 6.1 Liste erstellen

Das bestehende Listenformular erhält:

- Checkbox `Checkliste`
- Hilfetext `Aufgaben ohne Datum aus dieser Liste werden nur in der Liste angezeigt.`

Standardwert: nicht aktiviert.

### 6.2 Liste bearbeiten

Der bestehende Vorgang `Liste umbenennen` wird fachlich zu `Liste bearbeiten` erweitert.

Bearbeitbar sind:

- Listenname
- Checklistenstatus

Beide Werte müssen korrekt vorausgefüllt sein. Die sichtbaren Texte und barrierearmen Bezeichnungen verwenden `Bearbeiten` beziehungsweise `Liste bearbeiten`, nicht mehr ausschließlich `Umbenennen`.

### 6.3 Standardliste

`Allgemein` bleibt:

- nicht löschbar
- nicht über das Listenformular bearbeitbar
- immer `isChecklist: false`

### 6.4 Keine weitere UI-Differenzierung

Nicht einführen:

- eigenes Checklisten-Icon
- Begriffe wie `Artikel` oder `Gekauft`
- eigenes Aufgabenformular
- eigene Farbe, Ansicht, Sortierung oder Abhaklogik
- Einkaufs- oder Checklistenmodus

## 7. Dynamisches Verhalten

Alle Änderungen müssen unmittelbar über den bestehenden React-State wirken, ohne Reload.

- Normale Liste wird Checkliste: undatierte Aufgaben verschwinden sofort aus globalen Ansichten; datierte bleiben sichtbar.
- Checkliste wird normale Liste: undatierte Aufgaben nehmen sofort wieder am bisherigen globalen Verhalten teil.
- Aufgabe wird in Checkliste verschoben: ohne Datum global ausblenden, mit Datum normal behandeln.
- Aufgabe wird aus Checkliste verschoben: Verhalten der neuen Liste sofort übernehmen.
- Datum wird gesetzt: Aufgabe wird global nach bestehenden Regeln sichtbar.
- Datum wird entfernt: undatierte Aufgabe einer Checkliste wird global ausgeblendet.

Bei diesen Vorgängen dürfen keine weiteren Task-Felder mutiert und keine Tasks allein wegen einer Listentypänderung neu gespeichert werden.

## 8. Mehrere Checklisten

Es dürfen beliebig viele Checklisten existieren. Die Logik darf nicht an Namen, Reihenfolge, eine feste Nutzerlisten-ID oder eine einzelne Einkaufsliste gekoppelt sein.

Unbekannte oder nicht mehr vorhandene Listen-IDs werden durch die neue Sichtbarkeitsregel nicht ausgeblendet. Die Regel arbeitet diesbezüglich fail-open; bestehende Integritätsregeln bleiben unberührt.

## 9. Bestehende Daten und Rückwärtskompatibilität

- Bestehende Listen ohne `isChecklist` gelten als normale Listen.
- Es gibt keine automatische Erkennung anhand des Listennamens.
- Bestehende Aufgaben bleiben unverändert.
- Es ist keine Task-Migration zulässig.
- Beim Laden und Import werden Listen in-memory normalisiert.
- Die Default-Liste wird bei jeder Normalisierung zwingend auf `isChecklist: false` gesetzt.

## 10. Persistenz und Backup

### 10.1 IndexedDB

Unverändert bleiben:

- Datenbankname `solotodo-db`
- Dexie-/IndexedDB-Version `2`
- Stores `tasks` und `lists`
- bestehende Indizes

`isChecklist` wird als nicht indexiertes Zusatzfeld im bestehenden Listenobjekt gespeichert. Es wird kein neuer Store und keine Datenbankmigration eingeführt.

### 10.2 Backup

Unverändert bleiben:

- Backup-Schemaversion `2`
- bisheriger Exportumfang
- bisherige Import- und Validierungslogik außerhalb der Listenfeldnormalisierung

Neue Backups enthalten `isChecklist`. Alte v2-Backups ohne dieses Feld bleiben importierbar und ergeben normale Listen. Nur echtes `true` bleibt beim Import eine Checkliste.

Der globale Checklisten-Sichtbarkeitsfilter darf niemals auf Backup-Anzahl, Backup-Erstellung oder Export angewendet werden. Alle Aufgaben, die vor CR_003 exportiert wurden, werden auch danach exportiert; insbesondere dürfen undatierte Checklistenaufgaben nicht entfernt werden.

## 11. Nicht-Ziele

CR_003 umfasst ausdrücklich nicht:

- neuen Task- oder Einkaufsartikel-Typ
- neue Task-Felder
- Mengen, Einheiten, Kategorien, Preise oder Geschäfte
- Einkaufsdatum oder automatische Datumsvergabe
- wiederkehrende Einkäufe oder Einkaufshistorie
- Liste zurücksetzen oder neue Sammellöschfunktionen
- neue Sortierung oder Drag & Drop
- Suche oder neue Navigation
- Cloud, Backend, Login oder Synchronisierung
- Änderungen an PWA-, Service-Worker- oder Hostingarchitektur
- allgemeine Refactorings oder nicht angeforderte UX-Verbesserungen

## 12. Akzeptanzkriterien

### AC-01 – Erstellung

Eine neue Liste ist standardmäßig keine Checkliste. Beim Erstellen kann `Checkliste` aktiviert werden und der Wert bleibt lokal gespeichert.

### AC-02 – Bearbeitung

Eine Nutzerliste kann mit vorausgefülltem Namen und Checklistenstatus bearbeitet werden. Beide Werte können geändert werden. `Allgemein` bleibt geschützt.

### AC-03 – Undatierte offene Checklistenaufgabe

Sie bleibt in ihrer Liste und deren Zähler sichtbar, erscheint jedoch nicht in `Ohne Datum`, `Markiert`, `Dringend`, `Alle Aufgaben` oder den entsprechenden globalen Zählern.

### AC-04 – Undatierte erledigte Checklistenaufgabe

Sie bleibt im Filter `Erledigt` ihrer Liste sichtbar und kann wieder geöffnet werden, erscheint aber nicht in `Alle Aufgaben`.

### AC-05 – Datierte Checklistenaufgabe

Sie verhält sich in allen globalen, zeitlichen und merkmalsbezogenen Ansichten wie eine normale datierte Aufgabe.

### AC-06 – Sofortige Neuberechnung

Datum, Listenzuordnung oder Checklistenstatus wirken sofort auf alle betroffenen Ansichten und Zähler.

### AC-07 – Listenübersichten

Checklisten erscheinen unverändert unter `Listen` und `Meine Listen`. Ihre offene Anzahl enthält auch undatierte Aufgaben.

### AC-08 – Mehrere Checklisten und unbekannte Liste

Die Regel funktioniert unabhängig für mehrere Checklisten. Aufgaben mit unbekannter Listen-ID werden nicht durch CR_003 unsichtbar.

### AC-09 – Bestehende Daten

Fehlende oder ungültige Werte werden als `false` normalisiert. Es gibt keine Erkennung nach Namen und keinen stillen Datenverlust. `Allgemein` bleibt immer normal.

### AC-10 – Backup

Backup-Schema und bisheriger Exportumfang bleiben unverändert. Checklistenstatus wird roundtrip-fähig gespeichert. Alte v2-Backups bleiben kompatibel. Der Sichtbarkeitsfilter entfernt keine Exportdaten.

### AC-11 – Regression

Normale Listen und sämtliche bestehenden Task-Funktionen bleiben unverändert. `npm test` und `npm run build` sind erfolgreich.

## 13. Definition of Done

CR_003 ist abgeschlossen, wenn:

1. alle Akzeptanzkriterien erfüllt sind,
2. fokussierte automatisierte Tests die Testreferenz abdecken,
3. vollständige Tests und Build erfolgreich sind,
4. verfügbare mobile, Persistenz- und Offline-Smoke-Tests durchgeführt wurden,
5. keine Konsolenfehler in den geprüften Kernflows auftreten,
6. DB-Version und Backup-Schemaversion weiterhin `2` sind,
7. kanonische Projektdokumente gezielt aktualisiert wurden,
8. keine Funktionen außerhalb des Scopes ergänzt wurden,
9. der Abschlussbericht Abweichungen und nicht ausführbare Prüfungen ehrlich ausweist.
