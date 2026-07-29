# TEST_PLAN.md

## Ziel

Der Testplan prueft den aktuellen Stand von SoloTodo V2 nach CR_005 auf lokale Datenintegritaet, Offline-Faehigkeit, Aufgabenlogik, Listen, Checklisten-Sichtbarkeit, verlaessliche Ruecknavigation aus Listendetails, Datums-Schnellaktionen, Smart Views, Backup v2 und mobile Bedienbarkeit.

Status: **aktuelle kanonische Test- und Smoke-Referenz** (29.07.2026).

## Automatisierte Tests

Ausfuehren:

```bash
npm test
npm run build
```

Zuletzt am 29.07.2026 ausgefuehrt: 16 Testdateien / 81 Tests bestanden; Produktionsbuild einschliesslich PWA-Service-Worker erfolgreich. Die CR_005-Tests pruefen Sichtbarkeit und Reihenfolge der Schnelldaten, `showPicker()` und beide Fallback-Faelle, alleinigen Datumszustand, Speichern, kontrollierte Datumswerte und bestehende Aufgaben. Ein Browser-Smoke bei `1013 x 912` bestaetigte den entfernten Detail-Datumsblock, die erhaltenen Detailfelder, den weiterhin ausloesbaren nativen Picker und 0 Konsolenfehler beziehungsweise Warnungen. Ein physisches Android-Geraet wurde nicht geprueft.

Abgedeckt:
- Task-Erstellung mit Default-Liste
- Pflichtfeldvalidierung
- Statuswechsel
- wiederkehrende Aufgabe wird beim Abhaken weitergeschoben
- Ueberfaelligkeitslogik
- Sortierung nach Datum und Uhrzeit
- Backup-Schema v2
- Import von Tasks und Listen
- Ablehnung ungueltiger JSON-Dateien
- Ablehnung ungueltiger `listId`-Referenzen
- Dexie-basierte Storage-Operationen fuer Tasks und Listen
- Default-Liste in der Storage-Schicht
- atomarer Import/Replace von Tasks und Listen
- ungueltiger Import zerstoert bestehende lokale Daten nicht
- StorageError-Codes bei Speicherfehlern
- `createId()` ohne `crypto.randomUUID`
- Speicherdiagnose ohne Ausgabe von Aufgabeninhalten
- Listenerstellung und -bearbeitung mit Checklistenstatus und Default-Listenschutz
- zentrale Checklisten-Sichtbarkeitsmatrix, mehrere Checklisten und unbekannte Listen-IDs
- globale Smart-View-Zaehlung bei unveraenderten Listenzaehlern
- eigene Listendetailansicht mit offenen, erledigten und markierten undatierten Checklistenaufgaben
- sichtbarer und zugaenglicher Listendetail-Zurueck-Button mit genau einem `onBack`-Aufruf
- Rueckkehr zur Listenuebersicht ueber Zurueck-Button, erneutes Tippen auf `Listen` und `popstate`
- genau ein `pushState` je Detailoeffnung, kein weiterer Aufruf durch Re-Render und kein reaktivierbarer Detailzustand nach Hauptbereichswechsel
- `Alle Aufgaben` bei unveraenderter Backup-Anzahl und Exportaktion
- Aufgabenformular ohne Schnellaktion `Diese Woche`, aber mit jederzeit sichtbarem `Datum waehlen`
- nativer Date Picker ueber `showPicker()` sowie sicherer `focus()`-/`click()`-Fallback
- alleiniges `draft.dueDate` fuer Picker, Schnelldaten, Speichern und bestehende Aufgaben
- unveraenderte Schnelldaten mit kontrolliertem Systemdatum
- Backup-v2-Roundtrip, alte/ungueltige `isChecklist`-Werte und vollstaendiger Task-Export

## Smoke Tests

1. App starten.
2. Dashboard erscheint.
3. Bottom Navigation zeigt `Dashboard`, `Geplant`, `Listen`, `Mehr`.
4. Wechsel zwischen Hauptansichten funktioniert.
5. Floating Action Button oeffnet das Task-Formular.
6. Aufgabe mit Titel speichern.
7. Ohne explizite Liste landet die Aufgabe in `Allgemein`.
8. App zeigt keine Konsolenfehler beim Start und bei den Kerninteraktionen.

## Aufgabenformular und Schnelldatum

- Bei geschlossenen Details sind `Heute`, `Morgen`, `Naechste Woche`, `Datum waehlen` und `Ohne Datum` in dieser Reihenfolge sichtbar; `Diese Woche` ist nur als formularbezogene Schnellaktion entfernt.
- `Datum waehlen` oeffnen, ein Datum auswaehlen, Details ein- und ausblenden und speichern; der gewaehlte Wert bleibt erhalten.
- Unter `Details anzeigen` wird kein zusaetzlicher Datumsblock angezeigt; Uhrzeit und die anderen Detailfelder bleiben vorhanden.
- Picker bei bestehendem Datum abbrechen; Datum, Titel, Liste, Notiz und weitere Formularwerte bleiben unveraendert.
- Die globale Smart View `Diese Woche` und Planung/Wochenansichten bleiben unveraendert.

## Listen

- `Allgemein` existiert automatisch.
- Neue Liste erstellen.
- Liste bearbeiten und Checklistenstatus wechseln.
- Checkliste erstellen; undatierte Aufgabe bleibt in der Liste und verschwindet aus `Ohne Datum`, `Markiert`, `Dringend` und `Alle Aufgaben`.
- Datum setzen und entfernen; globale Sichtbarkeit aendert sich sofort.
- Listentyp und Listenzuordnung wechseln; Views und Zaehler reagieren sofort, ohne Task-Migration.
- Nicht leere Liste loeschen und Bestaetigung mit Aufgabenanzahl pruefen.
- `Allgemein` kann nicht geloescht werden.
- Aufgabe einer Liste zuordnen.
- Listendetail zeigt standardmaessig offene Aufgaben.
- Filter `Offen`, `Erledigt`, `Markiert` pruefen.
- Listendetail ueber `Zurueck zu Listen` schliessen.
- Listendetail erneut oeffnen und ueber den bereits aktiven Hauptnavigationseintrag `Listen` schliessen.
- Listendetail erneut oeffnen und mit Browser-/Android-Zurueck schliessen; die Listenuebersicht muss sichtbar und die PWA geoeffnet bleiben.
- Mehrere Listen nacheinander oeffnen und schliessen; beim Wechsel in einen anderen Hauptbereich darf kein Detail-History-Zustand aktiv bleiben.

## Smart Views

- Heute zeigt heute und ueberfaellige offene Aufgaben.
- Geplant zeigt offene Aufgaben mit Datum.
- Diese Woche nutzt Montag bis Sonntag.
- Naechste Woche nutzt die Folgewoche Montag bis Sonntag.
- Markiert zeigt offene markierte Aufgaben.
- Dringend zeigt offene Aufgaben mit `priority: high`.
- Erledigte und archivierte Aufgaben erscheinen nicht standardmaessig.

## Geplant, Woche und Kalender

- Segment `Liste` zeigt gruppierte Aufgaben.
- Segment `Woche` zeigt Montag bis Sonntag mit Anzahl je Tag.
- Ausgewaehlter Wochentag zeigt Tagesaufgaben.
- Aufgabe fuer ausgewaehlten Tag erstellen.
- Segment `Kalender` zeigt Monatsauswahl und Tagesliste.
- Aufgabe auf anderes Datum verschieben.

## Wiederholungen

- taeglich
- woechentlich
- monatlich
- jaehrlich
- alle X Tage
- alle X Wochen
- alle X Monate
- Enddatum-Fall pruefen
- Beim Abhaken bleibt die Aufgabe offen und erhaelt das naechste Datum.

## Backup

- Export enthaelt `schemaVersion: 2`, `exportedAt`, `tasks`, `lists`.
- Tasks enthalten `listId`, `isFlagged`, `recurrence`, `sortOrder`.
- Import ersetzt Daten erst nach Bestaetigung.
- Import ersetzt Tasks und Listen atomar.
- Nach Import existiert `Allgemein`.
- Ungueltige Backups zerstoeren keine lokalen Daten.
- Alte v2-Listen ohne `isChecklist` werden normal; nur echtes `true` bleibt Checkliste und `Allgemein` bleibt `false`.
- Undatierte Checklistenaufgaben bleiben vollstaendig im Export enthalten.
- Bekannte Einschraenkung pruefen/dokumentieren: Der UI-Export erhaelt von `App.tsx` nur nicht archivierte Tasks; archivierte Records sind nicht Teil der erzeugten Datei.

## Speicherdiagnose

- In `Mehr` den Button `Speicherdiagnose ausfuehren` starten.
- Bericht zeigt IndexedDB-Verfuegbarkeit, DB-Version, Stores, Anzahl Tasks/Listen, Test-Schreib-/Loeschvorgang, ID-Erzeugung, Service-Worker-Status, Cache-Status und App-Version.
- Bericht enthaelt keine Aufgaben-Titel oder Notizen.
- Bericht laesst sich kopieren.

## Offline Regression

Voraussetzung: App wurde einmal online geladen.

- Internet deaktivieren.
- App oeffnen.
- Aufgabe erstellen, bearbeiten, loeschen.
- Liste erstellen, bearbeiten, loeschen.
- Backup exportieren.
- App neu oeffnen und lokale Daten pruefen.

## Android/PWA Smoke Test

1. App auf Android installieren bzw. zum Startbildschirm hinzufuegen.
2. Aufgabe erstellen.
3. Liste erstellen.
4. App vollstaendig schliessen und neu oeffnen.
5. Pruefen, dass Aufgabe und Liste erhalten bleiben.
6. Neue Version deployen und sichtbaren Update-Hinweis pruefen.
7. Speicherdiagnose ausfuehren und Bericht kopieren.
8. Internet deaktivieren, App oeffnen und eine Aufgabe lokal aendern.
9. App erneut oeffnen und Datenpersistenz pruefen.
