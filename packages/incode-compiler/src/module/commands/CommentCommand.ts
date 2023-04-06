/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { InCodeCommand } from "./InCodeCommand";

export class CommentCommand extends InCodeCommand {
  execute(args: string[]): string {
    return "// " + args.join(" ");
  }
}
