/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { InCodeCommand } from "./InCodeCommand";
import { Error } from "../Error";

export class WaitCommand extends InCodeCommand {
  execute(args: string[]): string {
    if (args.length < 1) {
      return Error.ERROR_MISSING_PARAMETER;
    } else {
      if (!parseFloat(args[0])) {
        return Error.ERROR_NOT_A_NUMBER;
      } else {
        return `// Diese Zeile wartet ${args[0]}000 Millisekunden\nawait new Promise(done => setTimeout(() => done(), ${args[0]}000))`;
      }
    }
  }
}
