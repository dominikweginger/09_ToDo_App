# CR_005 – Datums-Schnellaktionen bereinigen und „Datum wählen“ ergänzen

## 1. Dokumentstatus

- **Repository:** `dominikweginger/09_ToDo_App`
- **Produkt:** SoloTodo PWA
- **Change Request:** `CR_005`
- **Status:** zur Umsetzung freigegeben
- **Priorität:** hoch
- **Risiko:** niedrig
- **Umfang:** kleine, klar abgegrenzte Korrektur im Aufgabenformular
- **Erwarteter Ausgangsstand:** `master` nach CR_004 beziehungsweise aktueller Hauptbranch

Dieses Dokument ist die einzige erforderliche Umsetzungsreferenz für CR_005. Separate Execution-, Test- oder Goal-Dokumente sind aufgrund des begrenzten Umfangs nicht notwendig.

## 2. Ausgangsproblem

Im Aufgabenformular existiert aktuell die Datums-Schnellaktion `Diese Woche`.

Die zugehörige Funktion setzt das Fälligkeitsdatum jedoch auf das heutige Datum. Damit sind die Schnellaktionen `Heute` und `Diese Woche` funktional identisch.

Aktueller relevanter Code:

```ts
function setQuickDate(value: 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'none') {
  const today = todayKey();
  const nextWeek = addDays(startOfWeek(today), 7);
  const dueDate =
    value === 'today'
      ? today
      : value === 'tomorrow'
        ? addDays(today, 1)
        : value === 'this-week'
          ? today
          : value === 'next-week'
            ? nextWeek
            : '';

  setDraft({ ...draft, dueDate });
}
```

Der Button erzeugt dadurch keinen eigenständigen Nutzen und soll vollständig aus dem Aufgabenformular entfernt werden.

Gleichzeitig ist die freie Datumsauswahl derzeit nur innerhalb des Bereichs `Details anzeigen` erreichbar. Für die schnelle Aufgabenerfassung soll der Kalender direkt neben den bestehenden Datums-Schnellaktionen geöffnet werden können.

## 3. Ziel

CR_005 setzt zwei Änderungen um:

1. Die Schnellaktion `Diese Woche` wird vollständig aus dem Aufgabenformular und aus der zugehörigen Schnellaktionslogik entfernt.
2. Eine neue, jederzeit sichtbare Schnellaktion `Datum wählen` öffnet unmittelbar den Kalender zur Auswahl eines konkreten Datums.

Die bestehende Datumseingabe unter `Details anzeigen` bleibt erhalten und funktioniert weiterhin unverändert.

Beide Datumseingaben müssen ausschließlich dasselbe Feld verwenden:

```ts
draft.dueDate
```

Es darf keine zweite Datumsquelle und keinen zusätzlichen Datumszustand geben.

## 4. Verbindlicher Funktionsumfang

### 4.1 Schnellaktion „Diese Woche“ entfernen

Im Aufgabenformular sind vollständig zu entfernen:

- der sichtbare Button `Diese Woche`,
- der Schnellaktionswert `'this-week'`,
- die zugehörige Fallunterscheidung,
- ausschließlich für diese Schnellaktion bestehender, danach ungenutzter Code,
- veraltete Tests oder Testdaten für diese Schnellaktion.

Nach der Umsetzung darf in der Schnellaktionslogik von `TaskForm` kein Rest von `'this-week'` mehr vorhanden sein.

### 4.2 Abgrenzung zur Smart View „Diese Woche“

Die Entfernung betrifft ausschließlich die Datums-Schnellaktion im Aufgabenformular.

Nicht entfernt oder verändert werden dürfen:

- die globale Smart View `Diese Woche`,
- Wochenansichten,
- Filter für Aufgaben dieser Woche,
- Dashboard-Kacheln oder Navigationseinträge mit Wochenbezug,
- Domain- oder Servicefunktionen, die für die Smart View oder Wochenplanung benötigt werden.

Eine repositoryweite Suche nach `Diese Woche` oder `this-week` muss deshalb vor Änderungen prüfen, ob ein Fund zur Schnellaktion im `TaskForm` oder zu einer anderen weiterhin benötigten Funktion gehört.

### 4.3 Neue Schnellaktion „Datum wählen“

Im Aufgabenformular wird innerhalb der bestehenden Gruppe `Schnelldatum` ein neuer Button ergänzt.

Sichtbarer Text:

```text
Datum wählen
```

Position:

- in derselben Button-Gruppe wie `Heute`, `Morgen`, `Nächste Woche` und `Ohne Datum`,
- auch sichtbar, wenn `Details anzeigen` geschlossen ist,
- nicht ausschließlich innerhalb der optionalen Details,
- sinnvollerweise unmittelbar vor `Ohne Datum`.

Verbleibende Reihenfolge:

1. `Heute`
2. `Morgen`
3. `Nächste Woche`
4. `Datum wählen`
5. `Ohne Datum`

Der Button muss als echtes Element umgesetzt werden:

```html
<button type="button">Datum wählen</button>
```

### 4.4 Verhalten von „Datum wählen“

Beim Betätigen des Buttons öffnet sich unmittelbar der native Kalender beziehungsweise Date Picker des Browsers oder Betriebssystems.

Nach Auswahl eines Datums:

- wird `draft.dueDate` auf den ausgewählten Wert im Format `YYYY-MM-DD` gesetzt,
- bleibt das Aufgabenformular geöffnet,
- bleiben alle anderen bereits eingegebenen Werte unverändert,
- kann die Aufgabe normal gespeichert werden,
- enthält der gespeicherte Task das ausgewählte Fälligkeitsdatum.

Beim Abbrechen des Date Pickers:

- bleibt das bisherige `draft.dueDate` unverändert,
- entstehen keine Validierungsfehler,
- wird das Formular nicht geschlossen.

### 4.5 Gemeinsame Datumsquelle

Die Schnellaktion `Datum wählen` und das bestehende Feld:

```html
<input type="date">
```

unter `Details anzeigen` müssen auf dasselbe Feld zugreifen:

```ts
draft.dueDate
```

Verbindliche Anforderungen:

- kein zweiter React-State für das ausgewählte Datum,
- keine Kopier- oder Synchronisierungslogik zwischen zwei Datumswerten,
- keine abweichende Formatierung,
- jede Datumsänderung aktualisiert direkt `draft.dueDate`,
- Öffnen der Details zeigt immer den aktuell über die Schnellaktion ausgewählten Wert,
- Änderung im Detailfeld wird beim nächsten Öffnen des Date Pickers ebenfalls verwendet.

Ein zusätzliches technisch notwendiges Picker-Element ist zulässig, darf aber keinen eigenen Datumszustand besitzen.

## 5. Technische Umsetzungsvorgabe

Betroffene Hauptdatei:

```text
src/components/TaskForm.tsx
```

### 5.1 Schnellaktionslogik vereinfachen

Die zulässigen Werte von `setQuickDate` werden auf folgende Werte reduziert:

```ts
'today' | 'tomorrow' | 'next-week' | 'none'
```

Die Berechnung soll klar und ohne verschachtelte schwer lesbare Bedingung erfolgen.

Empfohlene Form:

```ts
function setQuickDate(value: 'today' | 'tomorrow' | 'next-week' | 'none') {
  const today = todayKey();

  const dueDateByAction = {
    today,
    tomorrow: addDays(today, 1),
    'next-week': addDays(startOfWeek(today), 7),
    none: ''
  } as const;

  setDraft((current) => ({
    ...current,
    dueDate: dueDateByAction[value]
  }));
}
```

Eine gleichwertige, gut lesbare Umsetzung ist zulässig.

Die funktionale Bedeutung der verbleibenden Buttons bleibt unverändert:

- `Heute` → heutiges Datum,
- `Morgen` → heutiges Datum plus ein Tag,
- `Nächste Woche` → Montag der nächsten Kalenderwoche,
- `Ohne Datum` → leerer Datumswert.

### 5.2 Date Picker öffnen

Für `Datum wählen` ist eine kleine zentrale Funktion zu verwenden, beispielsweise:

```ts
function openDatePicker(): void
```

Die Umsetzung soll den nativen Picker direkt aus dem Klick-Event öffnen.

Bevorzugtes Verhalten:

```ts
dateInputRef.current?.showPicker()
```

Falls `showPicker()` im jeweiligen Browser nicht verfügbar ist oder einen Fehler auslöst, muss ein geeigneter Fallback verwendet werden, beispielsweise:

```ts
dateInputRef.current?.focus()
dateInputRef.current?.click()
```

Anforderungen:

- keine neue externe Abhängigkeit,
- kein eigener Kalenderdialog,
- kein Date-Picker-Paket,
- kein Router- oder globaler State,
- Fehler durch nicht unterstütztes `showPicker()` dürfen die App nicht abbrechen,
- keine Fehlermeldung in der Browserkonsole bei normaler Benutzung.

### 5.3 Date Input

Der Picker darf technisch entweder:

1. das bereits bestehende Date Input unter `Details anzeigen` verwenden, oder
2. ein zusätzliches visuell verborgenes natives Date Input als Auslöser verwenden.

Falls Variante 2 verwendet wird:

- das Element darf nicht mit einem separaten Datum-State arbeiten,
- `value` muss direkt `draft.dueDate` sein,
- `onChange` muss direkt `draft.dueDate` aktualisieren,
- es darf nicht mit `display: none` verborgen werden, wenn dies das native Öffnen verhindert,
- es darf keinen zusätzlichen Tastatur-Tabstopp erzeugen,
- es muss barrierearm beschriftet sein,
- die vorhandene sichtbare Datumseingabe unter `Details anzeigen` bleibt erhalten.

Codex soll die kleinste browserrobuste Variante wählen, die mit der vorhandenen Komponentenstruktur funktioniert.

## 6. Voraussichtlich betroffene Dateien

Primär:

- `src/components/TaskForm.tsx`
- `src/components/TaskForm.test.tsx`

Optional, nur falls für ein visuell verborgenes Date Input notwendig:

- `src/styles.css`

Andere Dateien dürfen nur verändert werden, wenn dies technisch zwingend erforderlich ist.

## 7. Nicht-Ziele

CR_005 umfasst ausdrücklich nicht:

- Änderungen an der globalen Smart View `Diese Woche`,
- Entfernung anderer Wochenfunktionen,
- Umbenennung von `Nächste Woche`,
- Änderung der Definition von `Nächste Woche`,
- Vereinheitlichung mit `MoveDateChips`,
- Einführung von `Wochenende` oder `Bis Sonntag`,
- optische Markierung des aktuell gewählten Schnelldatums,
- neue Datumsformate,
- Validierungsänderungen,
- Änderungen an Wiederholungen,
- Änderungen am Task-Datenmodell,
- Änderungen an IndexedDB oder Dexie,
- Änderungen an Task-Services oder Repositories,
- Änderungen an Listen, Smart Views oder Planung,
- Änderungen am Speichervorgang,
- allgemeines Redesign des Aufgabenformulars,
- externe Kalenderintegration.

## 8. Schutz bestehender Funktionen

Folgende Funktionen müssen unverändert weiterarbeiten:

- neue Aufgabe mit ausschließlich einem Titel speichern,
- bestehende Aufgabe bearbeiten,
- Standarddatum aus `defaultDate`,
- bestehendes Fälligkeitsdatum beim Bearbeiten laden,
- `Heute`,
- `Morgen`,
- `Nächste Woche`,
- `Ohne Datum`,
- Datumseingabe unter `Details anzeigen`,
- Uhrzeit,
- Liste,
- Notiz,
- Priorität,
- Status,
- Markierung,
- Wiederholung,
- Validierung,
- Abbrechen und Speichern,
- alle Smart Views einschließlich `Diese Woche`,
- Offline-Fähigkeit und lokale Speicherung.

CR_005 darf keine Migration oder Änderung vorhandener Task-Datensätze auslösen.

## 9. Akzeptanzkriterien

CR_005 gilt nur als vollständig umgesetzt, wenn alle folgenden Kriterien erfüllt sind.

### Entfernung „Diese Woche“

- [ ] Im Aufgabenformular wird kein Button `Diese Woche` mehr angezeigt.
- [ ] Der Wert `'this-week'` wurde aus der Schnellaktions-Typdefinition entfernt.
- [ ] Die zugehörige Berechnungslogik wurde entfernt.
- [ ] In `TaskForm.tsx` existiert kein toter Code für diese Schnellaktion.
- [ ] Die globale Smart View `Diese Woche` funktioniert weiterhin unverändert.

### Neue Datumsauswahl

- [ ] Der Button `Datum wählen` ist bei geschlossenem Detailbereich sichtbar.
- [ ] Der Button befindet sich in der Gruppe `Schnelldatum`.
- [ ] Der Button ist ein echtes `button`-Element mit `type="button"`.
- [ ] Ein Klick öffnet den nativen Date Picker.
- [ ] Ein ausgewähltes Datum aktualisiert `draft.dueDate`.
- [ ] Das ausgewählte Datum wird beim Speichern an `onSave` übergeben.
- [ ] Das Öffnen von `Details anzeigen` zeigt denselben Datumswert.
- [ ] Eine Änderung im sichtbaren Datumsfeld aktualisiert denselben Wert.
- [ ] Das Abbrechen des Date Pickers verändert das bestehende Datum nicht.
- [ ] Nicht unterstütztes `showPicker()` verursacht keinen Absturz.

### Regression

- [ ] `Heute` setzt weiterhin das heutige Datum.
- [ ] `Morgen` setzt weiterhin den folgenden Kalendertag.
- [ ] `Nächste Woche` setzt weiterhin Montag der nächsten Kalenderwoche.
- [ ] `Ohne Datum` entfernt weiterhin das Fälligkeitsdatum.
- [ ] Bereits eingegebener Titel, Liste, Notiz und weitere Werte bleiben beim Öffnen des Pickers erhalten.
- [ ] Bearbeiten bestehender Aufgaben funktioniert unverändert.
- [ ] Alle bestehenden Tests bleiben grün.
- [ ] Der Produktionsbuild bleibt erfolgreich.

## 10. Automatisierte Tests

Die bestehenden Tests in `TaskForm.test.tsx` sind gezielt zu ergänzen.

Mindestens folgende Prüfungen sind erforderlich:

### 10.1 Sichtbare Schnellaktionen

1. `Diese Woche` ist nicht vorhanden.
2. `Datum wählen` ist vorhanden, obwohl `Details anzeigen` geschlossen ist.
3. `Heute`, `Morgen`, `Nächste Woche` und `Ohne Datum` sind weiterhin vorhanden.

### 10.2 Date Picker

1. Klick auf `Datum wählen` ruft bei vorhandener Unterstützung `showPicker()` auf.
2. Ist `showPicker()` nicht verfügbar oder wirft einen Fehler, wird der Fallback ohne Komponentenabsturz ausgeführt.
3. Eine simulierte Datumsauswahl aktualisiert das Date Input.
4. Nach Eingabe eines Titels und Auswahl eines Datums enthält der Aufruf von `onSave` den korrekten Wert:

```ts
expect.objectContaining({
  dueDate: 'YYYY-MM-DD'
})
```

### 10.3 Gemeinsamer Zustand

1. Datum über die Schnellaktion auswählen.
2. `Details anzeigen` öffnen.
3. Das sichtbare Feld `Datum` enthält denselben Wert.
4. Datum im sichtbaren Feld ändern.
5. Speichern.
6. `onSave` erhält den zuletzt gewählten Wert.

### 10.4 Bestehende Schnellaktionen

Mit kontrolliertem Systemdatum prüfen:

- `Heute`,
- `Morgen`,
- `Nächste Woche`,
- `Ohne Datum`.

Die Tests dürfen nicht vom realen Ausführungstag abhängig sein.

### 10.5 Smart-View-Schutz

Bestehende Tests für die Smart View `Diese Woche` müssen unverändert grün bleiben. Es ist kein neuer umfassender Smart-View-Test notwendig, sofern bereits entsprechende Abdeckung besteht.

## 11. Manuelle Smoke Tests

Empfohlener Viewport:

```text
390 × 844
```

Ablauf:

1. Neue Aufgabe öffnen.
2. Prüfen, dass `Diese Woche` nicht mehr angezeigt wird.
3. Prüfen, dass `Datum wählen` ohne Öffnen der Details sichtbar ist.
4. `Datum wählen` betätigen.
5. Ein konkretes Datum auswählen.
6. `Details anzeigen` öffnen.
7. Prüfen, dass das ausgewählte Datum im Feld `Datum` sichtbar ist.
8. Datum im Detailfeld ändern.
9. Details wieder schließen.
10. Aufgabe speichern.
11. Prüfen, dass die Aufgabe mit dem zuletzt gewählten Datum gespeichert wurde.
12. Vorgang wiederholen und den Date Picker abbrechen.
13. Prüfen, dass das bisherige Datum unverändert bleibt.
14. `Heute`, `Morgen`, `Nächste Woche` und `Ohne Datum` einzeln prüfen.
15. Bestehende Aufgabe mit Datum bearbeiten und speichern.
16. Globale Smart View `Diese Woche` öffnen und auf unveränderte Funktion prüfen.
17. Browserkonsole auf Fehler prüfen.

## 12. Verifikation

Nach der Umsetzung zwingend ausführen:

```bash
npm test
npm run build
```

CR_005 ist nicht abgeschlossen, wenn:

- `Diese Woche` noch als Schnellaktionsbutton sichtbar ist,
- `'this-week'` noch zur Schnellaktionslogik in `TaskForm` gehört,
- `Datum wählen` nur innerhalb der Details erreichbar ist,
- der Date Picker nicht geöffnet werden kann,
- zwei voneinander unabhängige Datumszustände entstehen,
- ein verbleibender Schnellaktionsbutton sein Verhalten verändert,
- die Smart View `Diese Woche` beeinträchtigt wird,
- Tests oder Build fehlschlagen,
- neue Konsolenfehler entstehen.

## 13. Codex-Ausführungsauftrag

```text
Implementiere ausschließlich CR_005 gemäß diesem Dokument.

Lies zuerst TaskForm.tsx, TaskForm.test.tsx und die unmittelbar relevante CSS-Datei. Entferne ausschließlich die Schnellaktion „Diese Woche“ einschließlich des Werts „this-week“ und ihrer Berechnungslogik. Die globale Smart View „Diese Woche“ und sonstige Wochenfunktionen müssen erhalten bleiben.

Ergänze in der sichtbaren Schnelldatum-Gruppe den Button „Datum wählen“. Öffne damit den nativen Date Picker browserrobust und ohne neue Abhängigkeit. Verwende für Schnellaktion und bestehendes Datumsfeld ausschließlich draft.dueDate; führe keinen zweiten Datumszustand ein.

Erhalte das Verhalten aller anderen Buttons unverändert. Ergänze fokussierte Tests für Entfernung, Picker-Aufruf, Fallback, gemeinsame Datumsquelle und bestehende Schnellaktionen. Führe anschließend npm test und npm run build aus und behebe alle durch CR_005 verursachten Fehler.

Ändere keine fachlich nicht betroffenen Dateien oder Funktionen.
```
