/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class RemoveCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 3) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      const element = args[0];
      let parent = args[args.length - 1];
      if (AliasManager.getTypeAliases(parent).length > 0) {
        parent = AliasManager.getTypeAliases(parent)[0];
      }
      return `// Diese Zeile entfernt das Element ${element} von dem Element ${parent}\n${parent}.removeChild(${element});`;
    }
  }
}
