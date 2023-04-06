/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AliasManager } from "../AliasManager";
import { InCodeCommand } from "./InCodeCommand";
import { Compiler } from "../Compiler";
import { Error } from "../Error";

export class AddCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 4) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      const element = args[0];
      let parent = args[args.length - 2];
      if (AliasManager.getTypeAliases(parent).length > 0) {
        parent = AliasManager.getTypeAliases(parent)[0];
      }

      return `// Diese Zeile fügt das Element ${element} zu dem Element ${parent} hinzu.\n${parent}.appendChild(${element});`;
    }
  }
}
