/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class CallCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length < 1) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      return `// Diese Zeile ruft die Funktion ${args[0]} auf\nwindow.incode.${args[0]}();`;
    }
  }
}
