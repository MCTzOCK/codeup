/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { InCodeCommand } from "./InCodeCommand";

export class JSCommand extends InCodeCommand {
  public static readonly COMMAND_NAME = "@";

  public execute(args: string[]): string {
    let c = args.join(" ");
    c = c.replace(/\u0000/g, " ");
    return c;
  }
}
