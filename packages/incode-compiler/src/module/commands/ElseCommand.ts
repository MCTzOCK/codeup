/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { InCodeCommand } from "./InCodeCommand";
import { CommandExecutor } from "./CommandExecutor";

export class ElseCommand extends InCodeCommand {
  public execute(args: string[]): string {
    if (args.length > 0) {
      return `else ${CommandExecutor.executeCommand(args.join(" "))}`;
    } else {
      return "else";
    }
  }
}
