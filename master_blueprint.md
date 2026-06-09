# MASTER_BLUEPRINT.md

## 1. Projektname

**Arbeitstitel:** SoloTodo PWA

**Offene Entscheidung:** Finaler App-Name.

---

## 2. Kurzbeschreibung

SoloTodo PWA ist eine persönliche, mobile To-Do-App mit Kalenderfokus. Die App soll für einen einzelnen Nutzer gedacht sein, auf dem Handy verwendet werden und sowohl online als auch offline funktionieren. Alle Aufgaben werden lokal auf dem Gerät gespeichert. Es gibt keine Benutzerkonten, keine Cloud-Synchronisierung und keine Teamfunktionen.

---

## 3. Ziel des Projekts

Ziel ist eine schlanke, stabile und alltagstaugliche To-Do-App, mit der Aufgaben schnell erfasst, geplant, im Kalender angezeigt und erledigt werden können.

Die App soll nicht möglichst viele Funktionen bieten, sondern die wichtigsten persönlichen Aufgaben-Workflows zuverlässig und einfach abbilden.

---

## 4. Zielnutzer

Der Zielnutzer ist eine einzelne Privatperson, die die App ausschließlich selbst verwendet.

Primärer Nutzungskontext:

* Nutzung am Smartphone
* schnelle Eingabe unterwegs
* Tagesplanung
* Aufgaben mit und ohne Datum verwalten
* offline nutzbar bleiben
* keine externe Synchronisierung notwendig

---

## 5. Kernproblem

Viele To-Do-Apps sind für den gewünschten Zweck zu umfangreich, cloudbasiert, kontoabhängig oder auf Teams, Projekte und plattformübergreifende Nutzung ausgelegt.

Gesucht wird eine persönliche, einfache und robuste Lösung, die:

* ohne Login funktioniert
* offline verwendbar ist
* lokal speichert
* einen klaren Kalenderbezug hat
* schnell bedienbar ist
* nicht durch unnötige Funktionen überladen wird

---

## 6. Geplante Lösung

Es soll eine mobile-first Progressive Web App erstellt werden.

Die App wird lokal auf dem Smartphone installiert bzw. über den Browser als App genutzt. Die Daten werden lokal im Browser gespeichert. Die App soll auch ohne Internetverbindung geöffnet und verwendet werden können.

Kernansichten:

* Heute
* Kalender
* Inbox
* Mehr / Einstellungen

Der Schwerpunkt liegt auf schneller Aufgabenerfassung, Tagesübersicht, Kalenderplanung und lokaler Datensicherheit durch Export/Import.

---

## 7. Muss-Funktionen

Die folgenden Funktionen gehören zum MVP und müssen umgesetzt werden.

### Aufgabenverwaltung

* Aufgabe erstellen
* Aufgabe bearbeiten
* Aufgabe löschen
* Aufgabe als erledigt markieren
* erledigte Aufgabe wieder öffnen
* Aufgabenstatus speichern

### Aufgabenfelder

Eine Aufgabe muss mindestens folgende Felder unterstützen:

* Titel
* Status
* Erstellungsdatum
* optionales Fälligkeitsdatum
* optionale Uhrzeit
* optionale Notiz
* optionale Priorität

### Ansichten

* Heute-Ansicht
* Kalenderansicht
* Inbox für Aufgaben ohne Datum
* einfache Gesamtübersicht oder Suche

### Kalenderlogik

* Aufgaben einem Datum zuweisen
* Aufgaben ohne Datum separat anzeigen
* Tagesliste für ausgewählten Kalendertag anzeigen
* Aufgaben auf ein anderes Datum verschieben

### Offline-Fähigkeit

* App funktioniert ohne Internetverbindung
* App-Shell ist offline verfügbar
* Aufgaben können offline erstellt, bearbeitet und erledigt werden

### Lokale Speicherung

* Aufgaben werden lokal auf dem Gerät gespeichert
* Keine Serverdatenbank
* Kein Login
* Keine externe Synchronisierung

### Backup

* Aufgaben als JSON exportieren
* Aufgaben aus JSON importieren
* Import darf bestehende Daten nicht unkontrolliert zerstören

### Mobile Nutzung

* UI ist für Smartphone-Bedienung optimiert
* Bedienung über Touch
* schnelle Erfassung über gut sichtbaren Plus-Button

---

## 8. Soll-Funktionen

Diese Funktionen sind wichtig, aber nach dem MVP umsetzbar, falls der Aufwand sonst zu groß wird.

* Kategorien oder Listen, z. B. Privat, Arbeit, Einkauf, Sport
* Filter nach offen, erledigt, überfällig
* Prioritätsfilter
* Wiederkehrende Aufgaben
* Dark Mode
* einfache Einstellungen
* Bestätigungsdialog vor dauerhaftem Löschen
* Anzeige überfälliger Aufgaben in der Heute-Ansicht

---

## 9. Kann-Funktionen

Diese Funktionen sind optional und nur umzusetzen, wenn die Basis stabil ist.

* lokale Erinnerungen / Benachrichtigungen
* Statistiken, z. B. erledigte Aufgaben pro Woche
* CSV-Export
* CSV-Import
* App-Icon und Splashscreen
* einfache PIN-Sperre
* Schnellaktionen für „Morgen“, „Nächste Woche“, „Ohne Datum“
* automatische Backup-Erinnerung
* KI-gestützte Aufgabenplanung

---

## 10. Nicht-Ziele

Folgende Punkte sind bewusst nicht Teil des Projekts:

* Kein Benutzerkonto
* Keine Cloud-Synchronisierung
* Keine Teamfunktionen
* Keine Freigabe von Aufgaben an andere Nutzer
* Keine Desktop-Optimierung als Hauptziel
* Keine App-Store-Veröffentlichung im ersten Schritt
* Keine native Android-App im ersten Schritt
* Keine iOS-spezifische Entwicklung
* Keine Projektmanagement-App
* Kein Kanban-Board im MVP
* Keine komplexe Rechteverwaltung
* Keine Server-Infrastruktur
* Keine externen Kalenderintegrationen im MVP
* Keine Synchronisierung mit Google Calendar, Outlook oder Todoist
* Keine Multi-User-Funktionalität

---

## 11. Technische Grundannahmen

### Zieltechnologie

Die App wird als Progressive Web App umgesetzt.

Empfohlener Stack:

* HTML
* CSS
* JavaScript oder TypeScript
* modernes Frontend-Build-Setup
* lokale Browserdatenbank
* Service Worker für Offline-Fähigkeit

**Offene Entscheidung:** Konkretes Framework festlegen: Vanilla JavaScript, React, Vue oder Svelte.

Pragmatische Empfehlung für Codex:

* Bei einfacher Umsetzung: Vanilla JavaScript oder React
* Bei besserer Struktur für Wachstum: React mit Vite

### Offline-First-Prinzip

Die App muss ohne aktive Internetverbindung nutzbar sein. Die lokale Datenhaltung ist die zentrale Datenquelle.

### Lokale Speicherung

Empfohlen:

* IndexedDB für Aufgaben und App-Daten
* optional Wrapper-Bibliothek wie Dexie.js, falls verwendet

**Offene Entscheidung:** Ob IndexedDB direkt oder über eine Hilfsbibliothek genutzt wird.

### Deployment

Die App kann lokal entwickelt und später auf eine einfache statische Hosting-Umgebung gelegt werden.

**Offene Entscheidung:** Wo die PWA später gehostet wird, z. B. lokal, GitHub Pages, Netlify oder anderer statischer Host.

### Sicherheitsannahme

Die App ist nicht für öffentliche Mehrbenutzer-Nutzung gedacht. Da sie als PWA technisch über eine URL erreichbar sein kann, ist „nur auf meinem Handy“ im MVP kein harter technischer Zugriffsschutz, sondern ein Nutzungskonzept.

**Offene Entscheidung:** Ob später eine einfache lokale PIN-Sperre oder ein Zugriffsschutz ergänzt werden soll.

---

## 12. Datenmodell / Datenquellen

### Datenquelle

Die einzige primäre Datenquelle ist die Eingabe des Nutzers innerhalb der App.

Sekundäre Datenquellen:

* JSON-Import aus Backup-Datei
* später optional CSV-Import

### Entität: Task

Vorgeschlagenes Datenmodell:

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "status": "open | done | archived",
  "dueDate": "YYYY-MM-DD | null",
  "dueTime": "HH:mm | null",
  "priority": "none | low | medium | high",
  "categoryId": "string | null",
  "tags": ["string"],
  "isRecurring": false,
  "recurrenceRule": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime",
  "completedAt": "ISO datetime | null"
}
```

### Entität: Category

Für MVP optional, für spätere Soll-Funktion vorgesehen.

```json
{
  "id": "string",
  "name": "string",
  "color": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### Backup-Format

Backup-Dateien sollen als JSON exportiert werden.

Vorgeschlagene Struktur:

```json
{
  "schemaVersion": 1,
  "exportedAt": "ISO datetime",
  "tasks": [],
  "categories": []
}
```

---

## 13. UI-Grundidee

Die App wird konsequent mobile-first gestaltet.

### Hauptnavigation

Unten eine Tab-Navigation mit vier Bereichen:

```text
Heute | Kalender | Inbox | Mehr
```

### Zentrale Aktion

Ein gut sichtbarer Button zum Erstellen neuer Aufgaben:

```text
+ Aufgabe
```

### Aufgabenkarte

Aufgaben werden als kompakte Karten dargestellt.

Beispiel:

```text
☐ Rechnung prüfen
Heute · Hoch · Arbeit
Notiz vorhanden
```

### Task-Detailansicht

Beim Antippen einer Aufgabe öffnet sich eine Detailansicht oder ein Bottom Sheet mit:

* Titel
* Notiz
* Datum
* Uhrzeit
* Priorität
* Kategorie
* Status
* Löschen / Archivieren

### Gestaltungsprinzipien

* kurze Wege
* große Touch-Ziele
* keine überladene Oberfläche
* klare Unterscheidung zwischen offenen, erledigten und überfälligen Aufgaben
* schnelle Bedienung wichtiger als optische Spielerei

---

## 14. Wichtige Workflows

### Workflow 1: Aufgabe schnell erfassen

1. Nutzer öffnet die App.
2. Nutzer tippt auf „+ Aufgabe“.
3. Nutzer gibt einen Titel ein.
4. Optional setzt der Nutzer Datum, Uhrzeit, Priorität oder Notiz.
5. Nutzer speichert die Aufgabe.
6. Aufgabe erscheint je nach Datum in Heute, Kalender oder Inbox.

### Workflow 2: Heute planen

1. Nutzer öffnet die Heute-Ansicht.
2. App zeigt überfällige und heutige Aufgaben.
3. Nutzer erledigt, bearbeitet oder verschiebt Aufgaben.
4. Änderungen werden sofort lokal gespeichert.

### Workflow 3: Aufgabe im Kalender planen

1. Nutzer öffnet die Kalenderansicht.
2. Nutzer wählt einen Tag.
3. App zeigt Aufgaben für diesen Tag.
4. Nutzer erstellt neue Aufgabe für diesen Tag oder verschiebt bestehende Aufgabe.

### Workflow 4: Inbox aufräumen

1. Nutzer öffnet die Inbox.
2. App zeigt Aufgaben ohne Datum.
3. Nutzer weist Aufgaben ein Datum zu oder erledigt/löscht sie.
4. Aufgaben mit Datum verschwinden aus der Inbox.

### Workflow 5: Backup exportieren

1. Nutzer öffnet Mehr / Einstellungen.
2. Nutzer wählt „Backup exportieren“.
3. App erstellt JSON-Datei mit allen lokalen Daten.
4. Nutzer kann Datei lokal speichern.

### Workflow 6: Backup importieren

1. Nutzer öffnet Mehr / Einstellungen.
2. Nutzer wählt „Backup importieren“.
3. Nutzer wählt JSON-Datei aus.
4. App prüft Struktur und Schema-Version.
5. App importiert Daten nach definierter Importlogik.

**Offene Entscheidung:** Importlogik: bestehende Daten ersetzen oder Daten zusammenführen.

---

## 15. Fehlerfälle

Folgende Fehlerfälle müssen berücksichtigt werden:

### Eingabefehler

* Aufgabe ohne Titel darf nicht gespeichert werden
* ungültiges Datum darf nicht gespeichert werden
* ungültige Uhrzeit darf nicht gespeichert werden

### Speicherfehler

* lokale Datenbank nicht verfügbar
* Schreibfehler beim Speichern
* Lesefehler beim Laden
* Speicherlimit des Browsers erreicht

### Offline-Fälle

* App wird ohne Internet geöffnet
* App wurde noch nie geladen und ist daher nicht offline verfügbar
* Service Worker ist nicht korrekt installiert

### Import-/Export-Fehler

* ungültige JSON-Datei
* falsche Schema-Version
* leere Backup-Datei
* beschädigte Backup-Datei
* Import würde bestehende Daten überschreiben

### Bedienfehler

* versehentliches Löschen
* versehentliches Erledigen
* doppelte Aufgaben nach Import

---

## 16. Einschränkungen

* Die App ist für Smartphone-Nutzung optimiert.
* Desktop-Nutzung ist möglich, aber nicht primäres Ziel.
* Die App speichert Daten lokal im Browserkontext.
* Bei Browserdaten-Löschung können Aufgaben verloren gehen.
* Ohne Backup gibt es keine Wiederherstellung.
* PWA-Benachrichtigungen können je nach Gerät, Browser und Berechtigungen eingeschränkt sein.
* „Nur auf meinem Handy“ ist im MVP kein technischer Zugriffsschutz.
* Keine Garantie für plattformübergreifendes Verhalten außerhalb des primären Zielgeräts.

---

## 17. Risiken

### Technische Risiken

* IndexedDB-Handling kann komplex werden.
* Offline-Fähigkeit muss sauber getestet werden.
* PWA-Verhalten kann je nach Browser unterschiedlich sein.
* Lokale Daten können verloren gehen, wenn Browserdaten gelöscht werden.
* Benachrichtigungen sind in PWAs potenziell komplexer als in nativen Apps.

### Produkt-Risiken

* Zu viele Funktionen könnten den MVP unnötig aufblähen.
* Wiederkehrende Aufgaben können komplex werden.
* Kalenderansicht kann auf kleinen Displays schnell überladen wirken.
* Wenn Backup/Export vergessen wird, besteht Datenverlustrisiko.

### Umsetzungsrisiken mit Codex

* Codex könnte zu früh zu viel Architektur bauen.
* Codex könnte unnötige Cloud-, Login- oder Backend-Komponenten hinzufügen.
* Codex könnte Features vermischen, die bewusst erst später vorgesehen sind.
* Ohne klare Tests kann Offline-Funktionalität scheinbar funktionieren, aber instabil sein.

---

## 18. Offene Entscheidungen

Folgende Punkte sind bewusst noch offen:

1. Finaler Projektname
2. Konkreter Frontend-Stack: Vanilla JavaScript, React, Vue oder Svelte
3. IndexedDB direkt oder über Dexie.js
4. Importlogik: Backup ersetzt bestehende Daten oder wird zusammengeführt
5. Ob Kategorien bereits im MVP enthalten sind oder erst danach
6. Ob wiederkehrende Aufgaben im MVP enthalten sind oder erst Version 2
7. Ob lokale Erinnerungen später umgesetzt werden sollen
8. Ob eine PIN-Sperre sinnvoll ist
9. Wo die PWA später gehostet wird
10. Ob die App rein lokal entwickelt oder öffentlich erreichbar gehostet wird
11. Welche Mindest-Browser-/Android-Version unterstützt werden soll

---

## 19. Definition of Done

Das Projekt gilt als MVP-fertig, wenn folgende Kriterien erfüllt sind:

* App kann auf dem Smartphone geöffnet und bedient werden.
* App kann als PWA installiert oder zum Startbildschirm hinzugefügt werden.
* App funktioniert nach erstem Laden auch offline.
* Aufgaben können erstellt, bearbeitet, gelöscht und erledigt werden.
* Aufgaben können mit Datum und optionaler Uhrzeit gespeichert werden.
* Aufgaben ohne Datum erscheinen in der Inbox.
* Aufgaben mit heutigem Datum erscheinen in der Heute-Ansicht.
* Aufgaben erscheinen am korrekten Tag in der Kalenderansicht.
* Überfällige Aufgaben werden erkennbar angezeigt.
* Daten bleiben nach Schließen und erneutem Öffnen der App erhalten.
* JSON-Export funktioniert.
* JSON-Import funktioniert nach definierter Importlogik.
* Fehlerhafte Eingaben werden verständlich abgefangen.
* Keine Cloud-, Login- oder Backend-Abhängigkeit vorhanden.
* Basis-Smoke-Tests sind dokumentiert und erfolgreich durchgeführt.
* README beschreibt Zweck, Setup, Start und aktuellen Projektstatus.
* PRD, Technical Spec, Implementation Plan, Test Plan, AGENTS und ergänzende Docs sind konsistent.

---

## 20. Empfohlene Projektdokumente

Aus diesem Blueprint sollen folgende Projektdokumente erstellt werden:

```text
README.md
PRD.md
TECHNICAL_SPEC.md
IMPLEMENTATION_PLAN.md
TEST_PLAN.md
AGENTS.md
docs/UI_SPEC.md
docs/DATA_MODEL.md
docs/DECISIONS.md
docs/PROMPTS.md
```

### Dokumentzwecke

* `README.md`: Zweck, Setup, Start, Projektstatus
* `PRD.md`: Produktziel, Nutzer, Funktionen, Nicht-Ziele, Akzeptanzkriterien
* `TECHNICAL_SPEC.md`: Architektur, Datenfluss, Module, technische Regeln
* `IMPLEMENTATION_PLAN.md`: Phasen, Reihenfolge, Dateien, Umsetzungsschritte
* `TEST_PLAN.md`: Teststrategie, Smoke Tests, Abnahmekriterien
* `AGENTS.md`: dauerhafte Arbeitsregeln für Codex
* `docs/UI_SPEC.md`: Layout, Navigation, Ansichten, Interaktionen
* `docs/DATA_MODEL.md`: Datenmodell, Speicherlogik, Import/Export
* `docs/DECISIONS.md`: offene und getroffene Entscheidungen
* `docs/PROMPTS.md`: Codex-Prompts für Umsetzung, Prüfung und Refactoring
