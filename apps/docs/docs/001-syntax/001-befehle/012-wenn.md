# Wenn

Der `wenn` Befehl wird verwendet, um eine Reihe von Befehlen auszuführen, wenn eine Bedingung erfüllt ist oder ein [Ereignis](/docs/syntax/ereignisse) eintritt.

## Syntax

1. Abfrage: Auf das Schlüsselwort `wenn` folgt der Name einer Variable, ein [Operator](/docs/syntax/operatoren), ein Wert, das Schlüsselwort `ist` und die Befehle die ausgeführt werden sollen, wenn die Bedingung erfüllt ist.
2. Ereignis: Auf das Schlüsselwort `wenn` folgt der Name einer Variable, ein [Ereignis](/docs/syntax/ereignisse), das Schlüsselwort `wird` und die Befehle die ausgeführt werden sollen, wenn das Ereignis eintritt.

| Befehl | Parameter |
| ------ | --------- |
| `wenn` | `<name_der_variable> <operator> <wert> ist <befehl>` |
| `wenn` | `<name_der_variable> <ereignis> wird <befehl>` |

Im nachfolgenden Beispiel ist die Syntax des `wenn` Befehls dargestellt.

```
    Wenn x gleich 1 ist
        Gib "x ist 1" in der Konsole aus
        Gib "x ist 1" in der Dialogbox aus
    
    Wenn y gedrückt wird
        Gib "y wurde gedrückt" in der Konsole aus
        Gib "y wurde gedrückt" in der Dialogbox aus

    Wenn x gleich 1 ist Gib "Hallo Welt" in der Dialogbox aus
    Wenn y gedrückt wird Gib "Hallo Welt" in der Dialogbox aus
```