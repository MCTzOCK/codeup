# CodeUp Reborn

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
    yarn --cwd apps/web ts-start-prod
```

## Lizenz

CodeUp ist unter der [GNU GENERAL PUBLIC LICENSE v3.0](https://choosealicense.com/licenses/gpl-3.0/) lizensiert.
