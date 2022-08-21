/**
 * packages/incode-compiler/src/commands/RemoveCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class RemoveCommand implements Command {
  /*
   * Remove Command
   *
   * Usage: Entferne <variable> vo[n|m] <variable|Bildschirm>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    const variable = sourceTree.args[0];
    let variableOrScreen = sourceTree.args[2];

    if (sourceTree.args.length < 3) {
      throw new Error("Missing arguments");
    }

    if (variableOrScreen.toLowerCase() === "bildschirm") {
      variableOrScreen = "document.body";
    }

    return `${variableOrScreen}.removeChild(${variable});`;
  }
}
