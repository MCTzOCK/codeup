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
import ConditionParser from "../ConditionParser";

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
      });`;
    } else if (
      ["gedrückt", "berührt", "verlassen"].includes(
        sourceTree.args[1].toLowerCase()
      )
    ) {
      let event = "";
      if (sourceTree.args[1].toLowerCase() === "gedrückt") {
        event = "click";
      } else if (sourceTree.args[1].toLowerCase() === "berührt") {
        event = "mouseover";
      } else if (sourceTree.args[1].toLowerCase() === "verlassen") {
        event = "mouseleave";
      }

      return `${sourceTree.args[0]}.addEventListener("${event}", (event) => {
          ${CommandExecutor.run(
            AbstractSyntaxTreeGenerator.generate(
              sourceTree.args
                .slice(3, sourceTree.args.length)
                .join(" ")
                .replace(/\u0000/g, " ")
            )[0]
          )}
      });`;
    } else {
      sourceTree.args = ["_", ...sourceTree.args];
      const cond = ConditionParser.parse(sourceTree);

      return `if(${cond})`;
    }
  }
}
