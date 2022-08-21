/**
 * packages/incode-compiler/src/commands/CreateCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
import { DOM } from "../types/DOM.Elements";

export default class CreateCommand implements Command {
  run(sourceTree: AbstractSyntaxTree): string {
    const name = sourceTree.args[0];
    const type = sourceTree.args[2];

    if (!name || !type) {
      throw new Error("Missing arguments");
    }

    if (type.toLowerCase() === "variable") {
      if (sourceTree.args.length === 3) {
        return `let ${name} = null;`;
      } else {
        const value = sourceTree.args[6].replace(/\u0000/g, " ");
        if (!value) {
          throw new Error("Missing value");
        }
        return `let ${name} = ${value};`;
      }
    } else {
      if (DOM.hasOwnProperty(type.toLowerCase())) {
        return `let ${name} = document.createElement("${
          DOM[type.toLowerCase()]
        }");`;
      } else {
        throw new Error("Unknown type");
      }
    }
  }
}
