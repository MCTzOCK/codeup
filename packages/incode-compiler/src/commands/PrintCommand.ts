/**
 * packages/incode-compiler/src/commands/PrintCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class PrintCommand implements Command {
  /*
   * Print Command
   *
   * Usage: Gib <text> in der <Konsole|Dialogbox> aus
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 5) {
      throw new Error("Missing arguments");
    }

    const text = sourceTree.args[0].replace(/\u0000/g, " ");
    let output = sourceTree.args[3];

    if (!text || !output) {
      throw new Error("Missing arguments");
    }

    if (output.toLowerCase() === "konsole") {
      return `console.log(${text});`;
    }

    if (output.toLowerCase() === "dialogbox") {
      return `alert(${text});`;
    }

    return `${output}(${text});`;
  }
}
