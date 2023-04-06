/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class PrintCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 4) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      if (AliasManager.getTypeAliases(args[3]).length > 0) {
        return `// Diese Zeile gibt den angegebenen Text in der ${
          args[3]
        } aus\n${AliasManager.getTypeAliases(args[3])[0]}(${args[0].replace(
          /\u0000/g,
          " "
        )});`;
      } else {
        return Error.ERROR_UNKNOWN_TYPE;
      }
    }
  }
}
