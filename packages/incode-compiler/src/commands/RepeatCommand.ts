/**
 * packages/incode-compiler/src/commands/RepeatCommand.ts
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

export default class RepeatCommand implements Command {
  /*
   * Repeat Command
   *
   * Usage:
   * - Wiederhole <Anzahl> mal
   * - Wiederhole solange <variable> <operator> <wert> ist
   * - Wiederhole solange <variable> <operator> <wert> ist und <Bedingung>
   * - Wiederhole solange <variable> <operator> <wert> ist oder <Bedingung>
   */
  run(sourceTree: AbstractSyntaxTree): string {
    if (sourceTree.args.length < 2) {
      throw new Error("Not enough arguments");
    }

    if (sourceTree.args.length === 2) {
      const rs = randomString(32);
      return `for(let ${rs} = 0; ${rs} < ${sourceTree.args[0]}; ${rs}++)`;
    } else if (sourceTree.args[0] === "solange") {
      return "while(" + ConditionParser.parse(sourceTree) + ")";
    } else {
      throw new Error("Not implemented");
    }
  }
}

function randomString(length: number): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
