# CR_004 – Rücknavigation aus Listendetails

## 1. Dokumentstatus

- **Repository:** `dominikweginger/09_ToDo_App`
- **Produkt:** SoloTodo PWA
- **Change Request:** `CR_004`
- **Status:** zur Umsetzung freigegeben
- **Priorität:** hoch
- **Risiko:** niedrig
- **Umfang:** kleine, klar abgegrenzte UX- und Navigationskorrektur
- **Erwarteter Ausgangsstand:** `master` nach CR_003

Dieses Dokument ist für CR_004 die einzige erforderliche Umsetzungsreferenz. Separate Execution-, Test- oder Goal-Dokumente sind aufgrund des kleinen Umfangs nicht erforderlich.

## 2. Problem

Beim Öffnen einer Liste wechselt die App von der Listenübersicht in das Listendetail. Aus diesem Detail gibt es derzeit keinen direkten Weg zurück zur Listenübersicht.

Zusätzlich setzt ein erneutes Tippen auf den bereits aktiven Hauptnavigationseintrag `Listen` das geöffnete Listendetail nicht zurück.

Dadurch muss der Nutzer derzeit zuerst in einen anderen Hauptbereich wechseln und anschließend erneut `Listen` öffnen. Das ist ein unnötiger Umweg in einem zentralen Nutzerablauf.

Auch die Browser- beziehungsweise Android-Zurück-Funktion soll ein geöffnetes Listendetail schließen, statt die PWA unmittelbar zu verlassen oder keinen sichtbaren Effekt zu haben.

## 3. Ziel

CR_004 ergänzt eine konsistente Rücknavigation für Listendetails.

Nach der Umsetzung gelten drei gleichwertige Möglichkeiten, zur Listenübersicht zurückzukehren:

1. sichtbarer Zurück-Button im Listendetail,
2. erneutes Tippen auf den Hauptnavigationseintrag `Listen`,
3. Browser- beziehungsweise Android-Zurück.

Alle drei Wege müssen ausschließlich das Listendetail schließen und die Listenübersicht anzeigen.

## 4. Verbindliches Zielverhalten

### 4.1 Sichtbarer Zurück-Button

Im Kopfbereich von `ListDetailView` wird oberhalb oder links neben dem Listentitel ein gut sichtbarer Button ergänzt.

Sichtbarer Text:

```text
← Zurueck zu Listen
```

Anforderungen:

- als echtes `<button type="button">`,
- mindestens bestehende Touch-Zielgröße der primären Navigation verwenden,
- Icon darf mit `ChevronLeft` aus `lucide-react` umgesetzt werden,
- verständliche barrierearme Bezeichnung,
- löst ausschließlich die Rückkehr zur Listenübersicht aus,
- verändert keine Aufgabe, Liste, Filtereinstellung oder gespeicherte Daten.

`ListDetailView` erhält dafür einen neuen Callback:

```ts
onBack: () => void
```

### 4.2 Hauptnavigation `Listen`

Wenn ein Listendetail geöffnet ist und der Nutzer auf `Listen` tippt:

- wird `selectedListId` zurückgesetzt,
- bleibt die Hauptansicht `lists`,
- wird die Listenübersicht angezeigt,
- wird kein neuer Listendetail-History-Eintrag erzeugt,
- bleiben Aufgaben und Listen unverändert.

Das Verhalten der anderen Hauptnavigationseinträge bleibt unverändert.

### 4.3 Browser- und Android-Zurück

Beim Öffnen eines Listendetails wird genau ein leichter History-Eintrag für dieses Listendetail angelegt.

Anforderungen:

- keine neue Router-Abhängigkeit,
- keine Änderung der sichtbaren URL erforderlich,
- kein vollständiges Routing einführen,
- `window.history.pushState` und `popstate` dürfen verwendet werden,
- Browser- beziehungsweise Android-Zurück schließt zuerst das Listendetail,
- die PWA bleibt auf der Listenübersicht geöffnet,
- ein erneutes Zurück kann danach dem normalen Browserverhalten folgen,
- Re-Renders dürfen keine zusätzlichen History-Einträge erzeugen,
- wiederholtes Öffnen desselben bereits geöffneten Details darf keinen doppelten Eintrag erzeugen.

### 4.4 Bereinigung des History-Zustands

Wenn der Nutzer ein Listendetail nicht über Browser-Zurück verlässt, sondern:

- über einen anderen Hauptnavigationseintrag,
- über den sichtbaren Zurück-Button,
- über erneutes Tippen auf `Listen`,

darf kein veralteter Listendetail-Zustand zurückbleiben, der bei einem späteren Browser-Zurück unerwartet wieder ausgelöst wird.

Die Umsetzung muss deshalb History-State und React-State konsistent halten.

## 5. Empfohlene technische Umsetzung

Die konkrete Implementierung darf angepasst werden, sofern alle Akzeptanzkriterien erfüllt sind.

Empfohlene Struktur:

### `src/views/ListDetailView.tsx`

- `onBack` zu den Props ergänzen.
- sichtbaren Zurück-Button rendern.
- vorhandene Filter, Aufgabenliste, Add-Button und Task-Aktionen unverändert lassen.

### `src/app/App.tsx`

Eine zentrale Funktion verwenden, beispielsweise:

```ts
function closeListDetail(): void
```

Diese Funktion ist die einzige UI-seitige Rückkehrlogik aus dem Listendetail.

Zusätzlich:

- beim Öffnen einer Liste einen markierten History-State anlegen,
- `popstate` registrieren und beim Unmount entfernen,
- bei Browser-Zurück das geöffnete Listendetail schließen,
- beim Wechsel der Bottom Navigation einen vorhandenen Detailzustand sauber beenden,
- beim Ziel `lists` immer die Listenübersicht anzeigen.

Ein möglicher History-Marker ist:

```ts
{
  solotodoSubView: 'list-detail',
  listId: string
}
```

Der bestehende History-State darf nicht unnötig überschrieben werden. Vorhandene Felder sind bei `pushState` oder `replaceState` zu erhalten.

### `src/styles.css`

Nur falls notwendig:

- kleine, bestehende Designsystem-konforme Klasse für den Zurück-Button,
- keine allgemeine Neugestaltung des Listendetails,
- keine Änderungen an Farben, Karten, Navigation oder Layout außerhalb des neuen Buttons.

## 6. Betroffene Dateien

Voraussichtlich:

- `src/app/App.tsx`
- `src/views/ListDetailView.tsx`
- `src/views/ListDetailView.test.tsx`
- optional neue oder bestehende App-Navigationstests
- `src/styles.css` nur bei tatsächlich notwendiger Button-Anpassung

Weitere Dateien dürfen nur geändert werden, wenn dies technisch zwingend erforderlich ist.

## 7. Nicht-Ziele

CR_004 führt ausdrücklich nicht ein:

- React Router oder eine andere Routing-Bibliothek,
- neue URLs oder Deep Links,
- Breadcrumb-Navigation,
- Rücknavigation für sämtliche Smart Views,
- Änderungen an Dashboard, Planung, Kalender oder Einstellungen,
- Änderungen am Datenmodell,
- Änderungen an IndexedDB, Dexie oder Repositories,
- Änderungen an Backup oder Import,
- Änderungen an Listen- oder Aufgabenlogik,
- Redesign des Listendetails,
- neue Animationen,
- neue globale Navigationskonzepte.

## 8. Schutz bestehender Funktionen

Folgende Funktionen müssen unverändert weiterarbeiten:

- Listenübersicht öffnen,
- Liste öffnen,
- Default-Liste `Allgemein`,
- Nutzerlisten erstellen, bearbeiten und löschen,
- Checklistenverhalten,
- offene, erledigte und markierte Aufgaben filtern,
- Aufgabe direkt in einer Liste erstellen,
- Aufgabe bearbeiten, löschen, markieren und erledigen,
- Datum verschieben,
- manuelle Sortierung,
- Floating Action Button und seine kontextabhängigen Standardwerte,
- alle Smart Views,
- Planung, Woche und Kalender,
- Backup, Import und Speicherdiagnose,
- PWA-Updatehinweis,
- lokale Persistenz und Offline-Fähigkeit.

CR_004 darf keine Task- oder Listenrecords schreiben, ändern oder migrieren.

## 9. Akzeptanzkriterien

CR_004 gilt nur als vollständig umgesetzt, wenn alle folgenden Punkte erfüllt sind.

### Sichtbare Navigation

- [ ] Jedes geöffnete Listendetail zeigt den Button `Zurueck zu Listen`.
- [ ] Der Button ist mit Tastatur erreichbar.
- [ ] Der Button besitzt eine verständliche barrierearme Bezeichnung.
- [ ] Ein Klick zeigt die Listenübersicht.
- [ ] Die zuvor geöffnete Liste bleibt unverändert gespeichert.

### Bottom Navigation

- [ ] Ein Tippen auf `Listen` innerhalb eines geöffneten Listendetails zeigt die Listenübersicht.
- [ ] Es ist kein Umweg über Dashboard, Geplant oder Mehr erforderlich.
- [ ] Die anderen Hauptnavigationseinträge funktionieren unverändert.

### Browser- und Android-Zurück

- [ ] Nach Öffnen eines Listendetails schließt einmaliges Browser-Zurück zuerst das Detail.
- [ ] Danach ist die Listenübersicht sichtbar.
- [ ] Die PWA wird dabei nicht bereits beim ersten Zurück verlassen.
- [ ] Es entstehen keine doppelten History-Einträge durch Re-Renders.
- [ ] Mehrfaches Öffnen und Schließen verschiedener Listen erzeugt kein unerwartetes Vor- oder Zurückspringen.

### Regression

- [ ] Aufgaben im Listendetail bleiben vollständig bedienbar.
- [ ] Filter `Offen`, `Erledigt` und `Markiert` bleiben funktionsfähig.
- [ ] Die kontextabhängige Aufgabenerstellung aus einer Liste verwendet weiterhin die geöffnete `listId`.
- [ ] Keine Daten werden durch Navigation verändert.
- [ ] Bestehende automatisierte Tests bleiben grün.
- [ ] Produktionsbuild bleibt erfolgreich.

## 10. Automatisierte Tests

Mindestens folgende Tests ergänzen oder anpassen:

### `ListDetailView`

1. Der Zurück-Button wird gerendert.
2. Der Button besitzt den erwarteten zugänglichen Namen.
3. Ein Klick ruft `onBack` genau einmal auf.
4. Bestehende Filter- und Aufgabenaktionen bleiben in den vorhandenen Tests unverändert erfolgreich.

### App-Navigation

Mindestens eine automatisierte Prüfung für jeden Navigationsweg:

1. Liste öffnen → sichtbaren Zurück-Button betätigen → Listenübersicht sichtbar.
2. Liste öffnen → `Listen` in der Bottom Navigation betätigen → Listenübersicht sichtbar.
3. Liste öffnen → `popstate` beziehungsweise History-Zurück auslösen → Listenübersicht sichtbar.
4. Wiederholtes Rendern erzeugt keinen weiteren `pushState`-Aufruf.
5. Beim Wechsel auf einen anderen Hauptbereich bleibt kein veralteter Listendetail-State aktiv.

Mocks und Test-Fixtures sollen klein bleiben. Keine umfassende neue Testinfrastruktur einführen.

## 11. Manuelle Smoke Tests

Viewport mindestens:

```text
390 × 844
```

Ablauf:

1. App starten.
2. `Listen` öffnen.
3. `Allgemein` öffnen.
4. `Zurueck zu Listen` betätigen.
5. Prüfen, dass die Listenübersicht erscheint.
6. Erneut eine Liste öffnen.
7. Den bereits aktiven Tab `Listen` betätigen.
8. Prüfen, dass die Listenübersicht erscheint.
9. Erneut eine Liste öffnen.
10. Android- oder Browser-Zurück betätigen.
11. Prüfen, dass zuerst die Listenübersicht erscheint und die PWA geöffnet bleibt.
12. Mehrere verschiedene Listen nacheinander öffnen und schließen.
13. Aufgabe innerhalb einer Liste erstellen und prüfen, dass die Listenzuordnung unverändert korrekt ist.
14. Filter und Task-Aktionen im Listendetail prüfen.
15. Browser-Konsole auf Fehler prüfen.

## 12. Verifikation

Nach der Umsetzung zwingend ausführen:

```bash
npm test
npm run build
```

Zusätzlich den manuellen Navigations-Smoke durchführen.

Die Umsetzung ist nicht abgeschlossen, wenn:

- Tests oder Build fehlschlagen,
- Browser-Zurück die PWA beim ersten Schritt verlässt,
- mehrere History-Einträge pro Detailöffnung entstehen,
- ein Rückweg Daten verändert,
- bestehende Funktionen im Listendetail regressieren.

## 13. Codex-Ausführungsauftrag

```text
Implementiere ausschließlich CR_004 gemäß diesem Dokument.

Lies zuerst die betroffenen Dateien und vorhandenen Tests. Halte die Änderung klein und verwende keine neue Routing-Abhängigkeit. Implementiere sichtbaren Zurück-Button, erneutes Tippen auf Listen und Browser-/Android-Zurück konsistent über eine zentrale Rückkehrlogik.

Ändere keine Datenmodelle, Repositories, Backups oder fachliche Aufgaben- und Listenlogik. Ergänze fokussierte Tests für alle drei Rückwege, führe npm test und npm run build aus und behebe sämtliche durch CR_004 verursachten Fehler.

Beende die Umsetzung erst, wenn alle Akzeptanzkriterien erfüllt sind und bestehende Funktionen unverändert funktionieren.
```
