# Erstelle

Der `erstelle` Befehl erstellt entweder ein Element, welches auf der Benutzeroberfläche angezeigt werden kann, oder eine
Variable, welche einen Wert enthält.

## Syntax

Um eine Variable zu erstellen, folgt auf das Schlüsselwort `erstelle` der Name der Variable, welcher ein Wort sein muss
und keine Sonderzeichen/Leerzeichen enthalten darf. Um ein Element zu erstellen, folgt auf das Schlüsselwort `erstelle`
der Name des Elements, welcher ein Wort sein muss und keine Sonderzeichen/Leerzeichen enthalten darf, und dann das
Schlüsselword `als`, abgeschlossen von dem [Typ](/docs/syntax/typen) des Elements.

| Befehl     | Parameter |
| ---------- | --------- |
| `erstelle` | `<var_name>` |
| `erstelle` | `<var_name> als <typ>` |

Im nachfolgenden Beispiel wird eine Variable mit dem Namen `test_variable` und ein Element vom Typ `Überschrift1` und dem Namen `test_element` erstellt.

```
    Erstelle test_variable
    Erstelle test_element als Überschrift1
```