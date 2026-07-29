# Dokumentations-Konsistenzcheck

Stand: 29.07.2026

## Ergebnis

Die zentralen Projektdokumente wurden nach der abgeschlossenen CR_006-Implementierung mit dem aktuellen Code, den fokussierten Tests, dem Build und den mobilen Browser-Smokes abgeglichen. Aktiver Datumstyp, alleiniger Picker-Wert und die bestaetigte Ausnahme fuer das entfernte redundante Detail-Datumsfeld sind konsistent beschrieben; Smart Views, Datenmodell, Dexie-Schema und Backup-Schema bleiben unveraendert.

## Kanonische Quellen

- Produkt: `PRD.md`
- Technik: `TECHNICAL_SPEC.md`
- Umsetzungsstand: `IMPLEMENTATION_PLAN.md`
- Tests und Smokes: `TEST_PLAN.md`
- Einstieg: `README.md`
- Detailreferenzen: `docs/DATA_MODEL.md`, `docs/UI_SPEC.md`, `docs/DECISIONS.md`
- Historie und CR-Status: `docs/CHANGELOG.md`

## Bereinigte Altstaende

- Die fruehere Aussage, Framework, Dexie-Nutzung und Importstrategie seien offen, ist ersetzt: React/Vite/TypeScript, Dexie/IndexedDB und bestaetigter atomarer Replace-Import sind implementiert.
- Die alte Navigation `Heute | Kalender | Inbox | Mehr` und Backup v1 bleiben nur im historischen `master_blueprint.md` erhalten.
- Die aktuelle Navigation ist `Dashboard | Geplant | Listen | Mehr`; `Ohne Datum` ist eine von sieben Smart Views.
- CR_003 ist umgesetzt, nicht mehr `zur Umsetzung freigegeben`; Execution Spec, Testreferenz und Goal-Prompt sind historische Ausfuehrungsunterlagen.
- CR_004 ist umgesetzt: Listendetails besitzen drei konsistente Rueckwege, ohne neue Routing-Abhaengigkeit oder sichtbare URL-Aenderung.
- CR_005 ist umgesetzt: Die formularbezogene Schnellaktion `Diese Woche` ist entfernt, waehrend Smart View und Wochenfunktionen erhalten bleiben; `Datum waehlen` nutzt den nativen Picker und ausschliesslich `draft.dueDate`.
- CR_006 ist umgesetzt: Genau ein Datumsbutton ist aus `draft.dueDate` abgeleitet aktiv, besitzt `aria-pressed="true"` und zeigt einen sichtbaren Haken; freie Daten werden im bestehenden Picker-Button formatiert angezeigt.
- Die historische Kurzform „alle Tasks im Backup“ ist fuer den UI-Flow praezisiert: Checklisten werden nicht gefiltert, archivierte Records gehoeren aber schon vor CR_003 nicht zum uebergebenen Exportbestand.

## Verifikation

- `npm test`: 16 Testdateien, 85 Tests bestanden (29.07.2026)
- `npm run build`: erfolgreich einschliesslich PWA-Service-Worker (29.07.2026)
- Chromium-Smoke gegen den Produktionsbuild bei `390 x 844`: Rueck-Button, `Listen`, Browser-Zurueck, History-Bereinigung, mehrere Listen, Listenzuordnung, Filter/Task-Aktionen, Offline-Neuladen und Konsole erfolgreich
- Browser-Smoke fuer CR_005 bei `1013 x 912`: Detail-Datumsblock entfernt, uebrige Detailfelder erhalten, nativer Picker ausloesbar und 0 Konsolenfehler beziehungsweise Warnungen
- Browser-Smoke fuer CR_006 bei `390 x 844` und `320 x 700`: aktive Zustaende, Haken, benutzerdefiniertes Datum, Picker-Rueckzuordnung, Tastaturfokus und horizontale Passform erfolgreich; 0 Konsolenfehler und 0 Warnungen
- nicht ausgefuehrt: physischer Android-/Installations-Smoke

## Verbleibende offene Entscheidungen

- Hosting-Ziel
- Mindest-Browser-/Android-Version
- moegliche spaetere lokale Erinnerungen
- moegliche spaetere PIN-Sperre

Diese Punkte sind keine implementierten Funktionen und aendern die aktuellen Nicht-Ziele nicht.
