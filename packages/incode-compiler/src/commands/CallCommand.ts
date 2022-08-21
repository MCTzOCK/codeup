/**
 * packages/incode-compiler/src/commands/CallCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class CallCommand implements Command {
  /*
   * Call Command
   *
   * Usage: Rufe <function> auf
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 1) {
      throw new Error("Missing arguments");
    }

    const name = sourceTree.args[0];

    if (!name) {
      throw new Error("Missing arguments");
    }

    return `${name}();`;
  }
}
