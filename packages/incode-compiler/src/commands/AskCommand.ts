/**
 * packages/incode-compiler/src/commands/AskCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class AskCommand implements Command {
  /*
   * Ask Command
   *
   * Usage: Frage <text> und speicher die Antwort in <variable>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 7) {
      throw new Error("Missing arguments");
    }

    const question = sourceTree.args[0].replace(/\u0000/g, " ");
    const name = sourceTree.args[6];

    if (!question || !name) {
      throw new Error("Missing arguments");
    }

    return `let ${name} = prompt(${question});`;
  }
}
