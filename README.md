
# CodeUp

![CodeUp Logo](https://static.content.ben-siebert.de/api/public/dl/tIMG2cZT?inline=true)

CodeUp ist eine Platform, die es Einsteigern erleichtert die Grundlagen der Programmierung zu erlernen.
Mit den interaktiven Video Kursen und der integrierten Programmierumgebung entsteht ein einzigartiges Erlebnis.
Außerdem verfügt CodeUp über eine Datenbank an Projektideen, die dazu verwendet werden können, gelerntes Wissen zu
festigen. Das Forum bietet Benutzern die Möglichkeit, sich untereinander auszutauschen und den eigenen Fortschritt zu teilen.



## Autoren

- [Ben Siebert (@MCTzOCK)](https://www.github.com/mctzock)


## Demo

Die Produktiv Veröffentlichung von CodeUp kann unter [https://codeup.space](https://codeup.space) eingesehen werden.


## Funktionen

- Sicheres Account System
- Video Kurse
    - Quizze
    - Creator Dashboard für Anpassung
    - Zertifikate
        - Mit anderen teilen
- Forum
    - Beiträge veröffentlichen
    - Antworten
    - Direktnachrichten
    - "Gefällt mir"-Funktion
- IDE
    - Mehrere Dateien
    - Vorschau von HTML und InCode Dateien
    - Out of the Box TypeScript und SCSS Support
    - Veröffentlichen von Projekten
    - Projekte als Vorlage veröffentlichen
    - Gemeinsam an Projekten arbeiten
    - Syntax Highlighting mit "Monaco Editor"
    - Hochladen von Dateien
- InCode Dokumentation
    - vollständige Dokumentation der InCode Programmiersprache
- Projektideen
    - Riesige Liste von Projektideen
    - Mehrere Schwierigkeitsstufen
- ToDo App
    - Mehrere Listen
    - Aufgaben als "Erledigt" markieren
    - Aufgaben/Listen löschen
- Projektplanung
    - Projekte mit Flussdiagrammen bis ins kleinste Deteil planen
- Admin Dashboard
    - Verwaltung von Benutzer Konten
    - Analytics
    - Verwalten von Projektideen
    - Verwalten von Zertifikaten
    - Verwalten von Kursen
    - Kontaktanfragen beantworten
    - Verwalten von Forum-Profilen
## Lokal ausführen

### Anforderungen

1. MongoDB Server: [Download](https://mongodb.com)
1. NodeJS >16: [Download](https://nodejs.org)
1. NPM: Ist in NodeJS enthalten.
1. Yarn: `npm i -g yarn`
1. Turborepo: `npm i -g turbo`
1. Git: [Download](https://git-scm.org)

### Schritt 1

CodeUp Repository von GitHub klonen und ins Verzeichnis wechseln.

```bash
    git clone https://github.com/MCTzOCK/CodeUp && cd CodeUp
```

### Schritt 2

Bibliotheken installieren

```bash
    yarn install
```

### Schritt 3

Bennene die Datei `apps/web/.env.example` zu `apps/web/.env` um.
Öffne anschließend die Datei mit deinem bevorzugten Texteditor
und passe die Umgebungsvariablen an.

### Schritt 4

Wenn du CodeUp im Entwickler-Modus (mit Hot-Module-Reloading) starten möchtest, dann führe folgenden Befehl aus:

```bash
    turbo run dev --filter=web
```

Wenn du CodeUp im Produktivmodus starten willst, musst du zunächst
das "Production Next.JS Build" von CodeUp erzeugen:

```bash
    turbo run build --filter=web
```

Anschließend kannst du CodeUp mit folgendem Befehl starten:

```bash
    yarn --cwd apps/web next:start
```
## Lizenz

CodeUp ist unter der [GNU GENERAL PUBLIC LICENSE v3.0](https://choosealicense.com/licenses/gpl-3.0/) lizensiert.

Folgendes ist erlaubt:
- kommerzielle Nutzung
- Verbreitung
- Modifizierung
- Verwendung im Rahmen eines Patentes
- Private Benutzung

Folgendes ist zu beachten:
- Öffentlicher Quellcode
- Lizenz und Urheberrechts Anmerkung
- Verwendung der gleichen Lizenz

Folgende Einschränkungen gibt es:
- Es wird keine Haftung übernommen
- Es gibt keine Garantie

Die gesamte Lizenz kann unter [https://choosealicense.com/licenses/gpl-3.0/](https://choosealicense.com/licenses/gpl-3.0/) eingesehen werden.
## Verwendete Technologien

- Next.js
- React
- Chakra UI
- JWT
- MongoDB
- Monaco Editor
- nodemailer
- TypeScript
- ESLint
- Prettier
- react-icons
- Caprover
- GitHub
- Webstorm
- GitKraken
- Undraw
- Git
- Turborepo
- Yarn
- Docker
- InCode
- DiceBear
- Copilot
- GrapesJS

Eine volle liste der verwendeten Technologien kann unter [https://codeup.space/codeup/about](https://codeup.space/codeup/about) eingesehen werden

## Support

Für jegliche Art von Support kann das Kontaktforumlar unter [https://codeup.sapce/codeup/contact](https://codeup.sapce/codeup/contact)
verwendet werden. Für dringliche Anfragen kannst du mich per E-Mail unter [hello@ben-siebert.de](mailto:hello@ben-siebert.de) erreichen.
Alternativ bin ich auf Discord (`MCTzOCK#0047`) erreichbar.


