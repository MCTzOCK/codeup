/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class RepeatCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 2) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      if (args.length === 2) {
        return `// Diese Zeile wiederholt die darunter stehenden Instruktionen ${args[0]} mal\nfor (let i = 0; i < ${args[0]}; i++)`;
      } else if (args.length === 6) {
        if (AliasManager.getOperatorAliases(args[2]).length > 0) {
          return `// Diese Zeile wiederholt die darunter stehenden Instruktionen solange die Variable ${
            args[1]
          } ${args[2]} der Variable ${args[4]} ist\nwhile(${args[1]} ${
            AliasManager.getOperatorAliases(args[2])[0]
          } ${args[4]})`;
        } else {
          return Error.ERROR_UNKNOWN_OPERATOR;
        }
      } else {
        return Error.ERROR_MISSING_PARAMETER;
      }
    }
  }
}
