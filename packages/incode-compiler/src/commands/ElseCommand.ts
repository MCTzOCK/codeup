/**
 * packages/incode-compiler/src/commands/ElseCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
import ConditionParser from "../ConditionParser";
import CommandExecutor from "../CommandExecutor";

export default class ElseCommand implements Command {
  /*
   * Else Command
   *
   * Usage:
   * - Sonst
   * - Sonst <wenn_befehl>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length === 0) {
      return "else";
    } else {
      let a = sourceTree.args;
      a.shift();

      const x = CommandExecutor.run({
        command: "Wenn",
        args: a,
        children: [],
        intents: 0,
      });

      return "else " + x;
    }
  }
}
