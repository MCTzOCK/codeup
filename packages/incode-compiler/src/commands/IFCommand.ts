/**
 * packages/incode-compiler/src/commands/IFCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import {
  AbstractSyntaxTree,
  AbstractSyntaxTreeGenerator,
} from "@codeup/incode-ast-generator";
import CommandExecutor from "../CommandExecutor";

export default class IFCommand implements Command {
  /*
   * IF Command
   *
   * Usage:
   * - Wenn <Bedingung>
   * - Wenn <Bedingung> und <Bedingung>
   * - Wenn <Bedingung> oder <Bedingung>
   * - Wenn <Bedingung> und <Bedingung> oder <Bedingung> ...
   * - Wenn <variable> <gedrückt|berührt|verlassen> wird
   * - Wenn Taste <Taste> gedrückt wird <command>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 1) {
      throw new Error("Not enough arguments");
    }

    if (sourceTree.args[0].toLowerCase() === "taste") {
      return `document.addEventListener("keydown", (event) => {
        if(event.key === "${sourceTree.args[1]}") {
          ${CommandExecutor.run(
            AbstractSyntaxTreeGenerator.generate(
              sourceTree.args
                .slice(4, sourceTree.args.length)
                .join(" ")
                .replace(/\u0000/g, " ")
            )[0]
          )}
        }
      })`;
    }

    return "";
  }
}
