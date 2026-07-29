# CR_006 – Gewähltes Fälligkeitsdatum in den Schnellaktionen sichtbar machen

## 1. Dokumentstatus

- **Repository:** `dominikweginger/09_ToDo_App`
- **Produkt:** SoloTodo PWA
- **Change Request:** `CR_006`
- **Status:** zur Umsetzung freigegeben
- **Priorität:** hoch
- **Risiko:** niedrig
- **Umfang:** kleine, klar abgegrenzte UX- und Accessibility-Verbesserung im Aufgabenformular
- **Voraussetzung:** CR_005 ist umgesetzt
- **Erwarteter Ausgangsstand:** aktueller Hauptbranch nach CR_005

Dieses Dokument ist die einzige erforderliche Umsetzungsreferenz für CR_006. Separate Execution-, Test- oder Goal-Dokumente sind wegen des kleinen Umfangs nicht erforderlich.

## 2. Problem

Die Datums-Schnellaktionen im Aufgabenformular zeigen derzeit nicht, welcher Wert ausgewählt wurde.

Nach einem Klick auf einen Button wie `Morgen` ist im kompakten Formular nicht eindeutig erkennbar, ob das Datum übernommen wurde. Das konkrete Fälligkeitsdatum ist erst sichtbar, wenn der Nutzer `Details anzeigen` öffnet.

Den Buttons fehlen insbesondere:

- ein sichtbarer ausgewählter Zustand,
- `aria-pressed`,
- ein Häkchen oder ein anderes nicht ausschließlich farbbasiertes Merkmal,
- eine sichtbare Beschriftung für ein frei gewähltes Datum.

## 3. Ziel

CR_006 macht den aktuellen Wert von `draft.dueDate` unmittelbar in der Schnellaktionsgruppe sichtbar.

Zu jedem Zeitpunkt muss genau eine der folgenden Datumsoptionen als ausgewählt erkennbar sein:

- `Heute`,
- `Morgen`,
- `Nächste Woche`,
- ein benutzerdefiniertes Datum,
- `Ohne Datum`.

Der Zustand wird ausschließlich aus `draft.dueDate` abgeleitet. Es darf kein zusätzlicher React-State für die aktive Schnellaktion eingeführt werden.

## 4. Verbindliches Zielverhalten

### 4.1 Aktiver Zustand

Jeder Datumsbutton erhält:

```tsx
aria-pressed={boolean}
```

Für den aktuell aktiven Button gilt:

- `aria-pressed="true"`,
- deutliche visuelle Hervorhebung,
- sichtbares Häkchen,
- ausreichender Kontrast,
- weiterhin vollständige Bedienbarkeit.

Für alle anderen Datumsbuttons gilt:

```tsx
aria-pressed="false"
```

Zu jedem Zeitpunkt darf genau ein Datumsbutton `aria-pressed="true"` besitzen.

### 4.2 Zuordnung des Datums

Die aktive Schnellaktion wird in dieser Reihenfolge aus `draft.dueDate` bestimmt:

1. leerer Wert → `Ohne Datum`,
2. heutiges Datum → `Heute`,
3. heutiges Datum plus ein Tag → `Morgen`,
4. Montag der nächsten Kalenderwoche → `Nächste Woche`,
5. jedes andere gültige Datum → benutzerdefiniertes Datum.

Die Auswahlquelle ist nicht relevant.

Beispiele:

- Wird morgen über `Datum wählen` ausgewählt, ist anschließend `Morgen` aktiv.
- Wird ein individuelles Datum im Feld unter `Details anzeigen` eingegeben, zeigt die Schnellaktionsgruppe dieses Datum sofort als aktive benutzerdefinierte Auswahl.
- Wird das Datum gelöscht, ist `Ohne Datum` aktiv.
- Wird eine bestehende Aufgabe geöffnet, muss ihr gespeichertes Datum sofort korrekt dargestellt werden.
- Wird das Formular mit `defaultDate` geöffnet, muss dieses Datum sofort korrekt dargestellt werden.

### 4.3 Sichtbare Darstellung der Presets

Nicht ausgewählt:

```text
Heute
Morgen
Nächste Woche
Ohne Datum
```

Ausgewählt, beispielhaft:

```text
✓ Morgen
```

Das Häkchen soll bevorzugt mit `Check` aus `lucide-react` umgesetzt werden:

```tsx
<Check size={16} aria-hidden="true" />
```

Das Häkchen ist rein visuell und darf den zugänglichen Namen des Buttons nicht unnötig verändern.

### 4.4 Benutzerdefiniertes Datum

Der in CR_005 ergänzte Button `Datum wählen` verhält sich abhängig vom aktuellen Datum:

#### Kein benutzerdefiniertes Datum aktiv

Sichtbarer Text:

```text
Datum wählen
```

Zustand:

```tsx
aria-pressed={false}
```

#### Benutzerdefiniertes Datum aktiv

Der Button zeigt anstelle von `Datum wählen` das konkrete Datum und ein Häkchen.

Beispiel:

```text
✓ Do., 06.08.2026
```

Für die sichtbare Datumsformatierung ist die vorhandene Funktion zu verwenden:

```ts
formatDateLabel(draft.dueDate)
```

Der Button bleibt weiterhin anklickbar. Ein erneuter Klick öffnet den Date Picker und ermöglicht die Änderung des Datums.

Es darf kein zusätzlicher, dauerhaft sichtbarer Datums-Chip außerhalb der bestehenden Schnellaktionsgruppe erzeugt werden. Der vorhandene Button `Datum wählen` wird im benutzerdefinierten Zustand selbst zum Datums-Chip.

### 4.5 Visuelle Hervorhebung

Die bestehende Schnellaktionsgestaltung wird um einen aktiven Zustand ergänzt.

Empfohlene Umsetzung ohne zusätzliche Komponentenklasse:

```css
.quick-actions button[aria-pressed='true'] {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}
```

Zusätzlich dürfen erforderlich sein:

```css
.quick-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
```

Anforderungen:

- nicht ausschließlich über Farbe kennzeichnen,
- Häkchen muss sichtbar bleiben,
- Text muss gut lesbar bleiben,
- Fokuszustand darf nicht entfernt werden,
- bestehendes Wrapping auf kleinen Displays bleibt erhalten,
- kein horizontales Überlaufen bei längeren Datumsbeschriftungen.

## 5. Technische Umsetzungsvorgabe

### 5.1 Aktiven Typ ableiten

In `TaskForm.tsx` ist der aktive Datumstyp aus dem aktuellen Draft abzuleiten.

Eine mögliche lokale Typdefinition:

```ts
type ActiveQuickDate = 'today' | 'tomorrow' | 'next-week' | 'custom' | 'none';
```

Empfohlene Ableitung:

```ts
function getActiveQuickDate(dueDate: string): ActiveQuickDate {
  const today = todayKey();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(startOfWeek(today), 7);

  if (!dueDate) return 'none';
  if (dueDate === today) return 'today';
  if (dueDate === tomorrow) return 'tomorrow';
  if (dueDate === nextWeek) return 'next-week';
  return 'custom';
}
```

Eine gleichwertige, klar lesbare Umsetzung ist zulässig.

Die Funktion muss rein sein und darf keine Daten verändern.

Im Renderpfad:

```ts
const activeQuickDate = getActiveQuickDate(draft.dueDate);
```

Kein `useState` für `activeQuickDate` einführen.

### 5.2 Wiederverwendung bestehender Logik

Weiterhin zu verwenden:

- `draft.dueDate` als einzige Datumsquelle,
- `todayKey()`,
- `addDays()`,
- `startOfWeek()`,
- `formatDateLabel()` für benutzerdefinierte Datumswerte,
- die durch CR_005 eingeführte Picker-Funktion.

Keine Datumsberechnung duplizieren, sofern sie sinnvoll gemeinsam abgeleitet werden kann.

### 5.3 Buttonstruktur

Jeder Preset-Button erhält seinen abgeleiteten Zustand.

Beispiel:

```tsx
<button
  type="button"
  aria-pressed={activeQuickDate === 'tomorrow'}
  onClick={() => setQuickDate('tomorrow')}
>
  {activeQuickDate === 'tomorrow' && <Check size={16} aria-hidden="true" />}
  Morgen
</button>
```

Der Button für die freie Datumsauswahl verwendet:

```tsx
const isCustomDate = activeQuickDate === 'custom';
```

Beispiel:

```tsx
<button
  type="button"
  aria-pressed={isCustomDate}
  onClick={openDatePicker}
  aria-label={
    isCustomDate
      ? `Ausgewähltes Datum ${formatDateLabel(draft.dueDate)}. Datum ändern`
      : 'Datum wählen'
  }
>
  {isCustomDate && <Check size={16} aria-hidden="true" />}
  {isCustomDate ? formatDateLabel(draft.dueDate) : 'Datum wählen'}
</button>
```

Die genaue Formulierung des `aria-label` darf geringfügig angepasst werden, muss aber Auswahl und Änderungsmöglichkeit verständlich beschreiben.

## 6. Voraussichtlich betroffene Dateien

Primär:

- `src/components/TaskForm.tsx`
- `src/components/TaskForm.test.tsx`
- `src/styles.css`

Optional:

- keine weiteren Dateien, sofern nicht technisch zwingend erforderlich.

CR_006 benötigt keine Änderungen an Datenmodell, Services, Repository oder Datenbank.

## 7. Nicht-Ziele

CR_006 umfasst ausdrücklich nicht:

- erneute Umsetzung oder Erweiterung von CR_005,
- Wiedereinführung der Schnellaktion `Diese Woche`,
- Umbenennung von `Nächste Woche`,
- Änderung der Datumsdefinitionen,
- Vereinheitlichung mit `MoveDateChips`,
- neue Presets wie `Wochenende`,
- Änderung des Date Pickers,
- dauerhafte Anzeige des Datums an einer zweiten Stelle,
- Änderung am Datumsfeld unter `Details anzeigen`,
- Validierungsänderungen,
- Änderungen an Smart Views oder Kalenderansichten,
- Änderungen am Task-Datenmodell,
- Speicherung eines eigenen Chip-Zustands,
- Animationen oder allgemeines Redesign.

## 8. Schutz bestehender Funktionen

Unverändert weiterarbeiten müssen:

- `Heute`,
- `Morgen`,
- `Nächste Woche`,
- `Datum wählen`,
- `Ohne Datum`,
- Date Picker aus CR_005,
- Datumseingabe unter `Details anzeigen`,
- `defaultDate`,
- Bearbeiten bestehender Aufgaben,
- Speichern und Abbrechen,
- Titel, Liste, Notiz, Uhrzeit, Priorität, Status, Markierung und Wiederholung,
- alle Smart Views einschließlich `Diese Woche`,
- lokale Speicherung und Offline-Fähigkeit.

Die Hervorhebung darf keine fachliche Änderung des gespeicherten Datums verursachen.

## 9. Akzeptanzkriterien

### Aktiver Zustand

- [ ] Jeder Datumsbutton besitzt `aria-pressed`.
- [ ] Genau ein Datumsbutton besitzt zu jedem Zeitpunkt `aria-pressed="true"`.
- [ ] Der aktive Button ist visuell deutlich hervorgehoben.
- [ ] Der aktive Button zeigt ein sichtbares Häkchen.
- [ ] Die Auswahl ist damit nicht ausschließlich über Farbe erkennbar.
- [ ] Nicht aktive Buttons zeigen kein Häkchen.

### Datumszuordnung

- [ ] Leeres `draft.dueDate` aktiviert `Ohne Datum`.
- [ ] Das heutige Datum aktiviert `Heute`.
- [ ] Morgen aktiviert `Morgen`.
- [ ] Der nächste Montag aktiviert `Nächste Woche`.
- [ ] Jedes andere gültige Datum aktiviert den benutzerdefinierten Datumsbutton.
- [ ] Es wird kein zusätzlicher Zustand für die aktive Auswahl gespeichert.

### Benutzerdefiniertes Datum

- [ ] Ohne benutzerdefiniertes Datum lautet der Button `Datum wählen`.
- [ ] Bei benutzerdefiniertem Datum zeigt der Button das formatierte konkrete Datum.
- [ ] Das sichtbare Format stammt aus `formatDateLabel()`.
- [ ] Der benutzerdefinierte Datumsbutton zeigt im aktiven Zustand ein Häkchen.
- [ ] Der Button öffnet weiterhin den Date Picker.
- [ ] Eine Änderung im Detailfeld aktualisiert den sichtbaren Datums-Chip sofort.
- [ ] Ein über den Picker gewähltes Preset-Datum aktiviert den passenden Preset-Button statt des benutzerdefinierten Buttons.

### Regression

- [ ] Alle Datumsbuttons setzen weiterhin dieselben Werte wie nach CR_005.
- [ ] Speichern übergibt weiterhin ausschließlich `draft.dueDate`.
- [ ] Bestehende Aufgaben zeigen beim Öffnen den korrekten aktiven Chip.
- [ ] `defaultDate` wird korrekt dargestellt.
- [ ] Die Schnellaktionsgruppe läuft bei 320 Pixel Breite nicht horizontal über.
- [ ] Bestehende Tests bleiben grün.
- [ ] Produktionsbuild bleibt erfolgreich.
- [ ] Es entstehen keine neuen Konsolenfehler.

## 10. Automatisierte Tests

Die Tests in `TaskForm.test.tsx` sind fokussiert zu ergänzen.

Das Systemdatum ist kontrolliert festzulegen, damit die Tests unabhängig vom Ausführungstag bleiben.

### 10.1 Initialzustand ohne Datum

- Neue Aufgabe ohne `defaultDate` öffnen.
- `Ohne Datum` besitzt `aria-pressed="true"`.
- Alle anderen Datumsbuttons besitzen `aria-pressed="false"`.
- Genau ein Button in der Gruppe `Schnelldatum` ist gedrückt.

### 10.2 Preset-Auswahl

Für `Heute`, `Morgen` und `Nächste Woche` jeweils prüfen:

- Button anklicken,
- angeklickter Button erhält `aria-pressed="true"`,
- zuvor aktiver Button wird `false`,
- sichtbares Häkchen erscheint nur beim aktiven Button,
- gespeichertes `dueDate` entspricht dem erwarteten Wert.

### 10.3 Ohne Datum

- Zuerst ein Datum auswählen.
- Danach `Ohne Datum` anklicken.
- `Ohne Datum` ist aktiv.
- `dueDate` ist leer.
- Alle anderen Datumsbuttons sind nicht aktiv.

### 10.4 Benutzerdefiniertes Datum

- Ein Datum auswählen, das weder heute, morgen noch nächster Montag ist.
- Der Button `Datum wählen` wird durch die formatierte Datumsanzeige ersetzt.
- Der Datumsbutton besitzt `aria-pressed="true"`.
- Der Datumsbutton zeigt ein Häkchen.
- Preset-Buttons besitzen `aria-pressed="false"`.
- Anklicken des formatierten Datumsbuttons öffnet weiterhin den Picker.

### 10.5 Preset über freien Picker

- Über das Date Input das morgige Datum setzen.
- `Morgen` wird aktiv.
- Der freie Datumsbutton zeigt wieder `Datum wählen`.
- Der freie Datumsbutton besitzt `aria-pressed="false"`.

### 10.6 Gemeinsame Datumsquelle

- Benutzerdefiniertes Datum setzen.
- `Details anzeigen` öffnen.
- Das sichtbare Feld `Datum` enthält denselben Wert.
- Datum im sichtbaren Feld auf ein Preset ändern.
- Der passende Preset-Chip wird unmittelbar aktiv.
- Speichern übergibt den zuletzt gewählten Wert.

### 10.7 Bestehende Aufgabe und Defaultwerte

Jeweils mindestens ein Test:

- bestehende Aufgabe mit benutzerdefiniertem Datum,
- neue Aufgabe mit `defaultDate`,
- bestehende Aufgabe ohne Datum.

Der korrekte Chip muss bereits beim ersten Rendern aktiv sein.

## 11. Manuelle Smoke Tests

Empfohlene Viewports:

```text
390 × 844
320 × 700
```

Ablauf:

1. Neue Aufgabe ohne Standarddatum öffnen.
2. Prüfen, dass `Ohne Datum` hervorgehoben ist und ein Häkchen zeigt.
3. `Heute` auswählen.
4. Prüfen, dass nur `Heute` hervorgehoben ist.
5. `Morgen` auswählen.
6. Prüfen, dass nur `Morgen` hervorgehoben ist.
7. `Nächste Woche` auswählen.
8. Prüfen, dass nur dieser Button hervorgehoben ist.
9. `Datum wählen` öffnen und ein individuelles Datum auswählen.
10. Prüfen, dass der Button das konkrete Datum samt Häkchen zeigt.
11. Den Datumsbutton erneut anklicken und das Datum ändern.
12. `Details anzeigen` öffnen und den identischen Wert prüfen.
13. Im Detailfeld morgen auswählen.
14. Prüfen, dass unmittelbar `Morgen` aktiv wird.
15. `Ohne Datum` auswählen.
16. Prüfen, dass der Datumswert entfernt und nur `Ohne Datum` aktiv ist.
17. Eine bestehende Aufgabe mit Datum öffnen.
18. Darstellung auf 390 und 320 Pixel Breite prüfen.
19. Tastaturnavigation und sichtbaren Fokus prüfen.
20. Browserkonsole auf Fehler prüfen.

## 12. Verifikation

Nach der Umsetzung zwingend ausführen:

```bash
npm test
npm run build
```

CR_006 ist nicht abgeschlossen, wenn:

- mehrere Chips gleichzeitig als aktiv erscheinen,
- kein Chip aktiv ist,
- die Auswahl nur über Farbe erkennbar ist,
- `aria-pressed` fehlt oder falsch ist,
- ein benutzerdefiniertes Datum im kompakten Formular nicht sichtbar ist,
- ein zweiter Datums- oder Auswahlzustand eingeführt wurde,
- das Öffnen des Date Pickers beeinträchtigt ist,
- Datumswerte anders gespeichert werden als vor CR_006,
- Tests oder Build fehlschlagen,
- neue Konsolenfehler entstehen.

## 13. Codex-Ausführungsauftrag

```text
Implementiere ausschließlich CR_006 gemäß diesem Dokument. CR_005 wird als umgesetzt vorausgesetzt.

Lies zuerst TaskForm.tsx, TaskForm.test.tsx, date-utils.ts und die Styles der quick-actions. Leite den aktiven Datums-Chip ausschließlich aus draft.dueDate ab. Führe keinen zusätzlichen React-State ein.

Ergänze aria-pressed für alle Datumsbuttons, eine deutliche aktive Darstellung und ein sichtbares Check-Icon. Verwende beim benutzerdefinierten Datum den bestehenden Button „Datum wählen“ als dynamischen Datums-Chip und formatiere ihn mit formatDateLabel(). Wenn ein frei gewähltes Datum einem Preset entspricht, muss der passende Preset-Button aktiv sein.

Ändere keine Datumsdefinition, keine Speicherlogik, keine Smart View und keine sonstige Funktion. Ergänze fokussierte Tests für Initialzustand, Presets, benutzerdefiniertes Datum, Detailfeld, defaultDate und bestehende Aufgaben.

Führe danach npm test und npm run build aus und behebe alle durch CR_006 verursachten Fehler. Beende die Umsetzung erst, wenn alle Akzeptanzkriterien erfüllt sind.
```
