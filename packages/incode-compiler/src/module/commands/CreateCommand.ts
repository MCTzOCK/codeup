/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class CreateCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 1) {
      return Error.ERROR_MISSING_PARAMETER;
    }
    if (args.length === 1) {
      return `// Diese Zeile erstellt die Variable ${args[0]}\nlet ${args[0]};`;
    } else {
      if (AliasManager.getTypeAliases(args[2]).length > 0) {
        if (AliasManager.getTypeAliases(args[2])[0] === "function") {
          return `// Diese Zeile erstellt die Funktion ${args[0]}\nwindow.incode.${args[0]} = () =>`;
        }
        return `// Diese Zeile erstellt die Variable ${args[0]} mit dem Typen ${
          args[2]
        }\nlet ${args[0]} = document.createElement('${
          AliasManager.getTypeAliases(args[2])[0]
        }');`;
      } else {
        return `// Diese Zeile erstellt die Variable ${args[0]} mit dem Typen div, da der eigentliche Typ nicht gefunden wurde\nlet ${args[0]} = document.createElement("div"); // "${args[2]}" -> Not Found`;
      }
    }
  }
}
