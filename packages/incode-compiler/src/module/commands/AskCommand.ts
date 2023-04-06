/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */

import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class AskCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length === 0) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      args[0] = args[0].replace(/\u0000/g, " ");
      if (args.length === 1) {
        return `// Diese Zeile fragt den Benutzer "${args[0]}"\nprompt(${args[0]});`;
      } else {
        return `// Diese Zeile fragt den Benutzer "${
          args[0]
        }" und speichert die Antwort in ${args[args.length - 1]}\nlet ${
          args[args.length - 1]
        } = prompt(${args[0]});`;
      }
    }
  }
}
