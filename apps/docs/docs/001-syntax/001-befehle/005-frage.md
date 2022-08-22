# Frage

Der `frage` Befehl zeigt dem Benutzer eine Frage an und speichert optional die Antwort in einer Variable.

## Syntax

Auf das Schlüsselwort `frage` folgt die Frage, die der Benutzer beantworten soll. Optional kann der Befehl durch "und speicher die Antwort in" und dem Namen der Variable erweitert werden.

| Befehl     | Parameter |
| ---------- | --------- |
| `frage` | `"Frage..."` |
| `frage` | `"Frage..." und speicher die Antwort in answer` |

**⚡ PROTIPP** Du kannst nach der Frage in Anführungszeichen direkt den Namen der Variable angeben, in der die Antwort gespeichert werden soll.

Im nachfolgenden Beispiel wird dem Benutzer eine Frage gestellt und die Antwort in einer Variable gespeichert.

```text
    Frage "Wie heißt du?"
    Frage "Wie heißt du?" und speicher die Antwort in name
    // ⚡ PROTIP
    Frage "Wie heißt du?" name 
```
