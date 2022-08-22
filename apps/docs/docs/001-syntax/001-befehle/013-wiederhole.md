# Wiederhole

Der `wiederhole` Befehl wiederholt einen Befehl eine bestimmte Anzahl von Iterationen. Er kann auch dazu genutzt werden,
einen Befehl zu wiederholen, solange eine Bedingung erfüllt ist.

## Syntax

1. Auf das Schlüsselwort `wiederhole` folgt die Anzahl der Iterationen und das Schlüsselwort `mal` bzw. `male`.
2. Auf das Schlüsselwort `wiederhole` folgt das Schlüsselwort `solange`, der Name einer Variable,
   ein [Operator](/docs/syntax/operatoren), ein Wert z.B. "1" und das Schlüsselwort "ist"

```
   wiederhole 3 mal
      Gib "Hallo Welt" in der Konsole aus
      Gib "Hallo Welt2" in der Dialogbox aus
   wiederhole solange x kleiner 2 ist
      Gib "Hallo Welt" in der Konsole aus
      Gib "Hallo Welt2" in der Dialogbox aus
```