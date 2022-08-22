# Sonst

Der `sonst` Befehl wird verwendet um Befehle auszuführen, wenn eine Bedingung nicht erfüllt ist.
Hierbei kann ebenfalls eine weitere Abfrage angegeben werden.

## Syntax

1. Ohne weitere Abfrage: Der Befehl ist durch das Schlüsselwort `sonst` komplett.
2. Mit weiterer Abfrage: Auf das Schlüsselwort `sonst` folgt ein [`wenn`](/docs/syntax/befehle/wenn) Befehl.

| Befehl | Parameter |
| ------ | --------- |
| `sonst` | &nbsp; |
| `sonst` | `<wenn befehl>` |

```
    Wenn x gleich 1 ist
        Gib "x=1" in der Konsole aus
    Sonst wenn x gleich 2 ist
        Gib "x=2" in der Konsole aus
    Sonst
        Gib "x ist nicht 1 oder 2" in der Konsole aus
```