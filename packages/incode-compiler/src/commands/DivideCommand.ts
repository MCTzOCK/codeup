/**
 * packages/incode-compiler/src/commands/DivideCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class DivideCommand implements Command {
  /*
   * Divide Command
   *
   * Usage: Dividiere <variable> durch <variable|zahl>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 3) {
      throw new Error("Missing arguments");
    }

    const name = sourceTree.args[0];
    const modifier = sourceTree.args[2];

    if (!name || !modifier) {
      throw new Error("Missing arguments");
    }

    return `${name} /= ${modifier};`;
  }
}
