/**
 * packages/incode-compiler/src/CommandExecutor.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.08.2022
 *
 */
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
import { Command } from "./types/Command";
import CommentCommand from "./commands/CommentCommand";
import CreateCommand from "./commands/CreateCommand";
import AddCommand from "./commands/AddCommand";

export default class CommandExecutor {
  public static readonly COMMANDS: {
    [key: string]: Command;
  } = {
    "@": new (class implements Command {
      run(sourceTree: AbstractSyntaxTree): string {
        return sourceTree.args.join(" ");
      }
    })(),
    "//": new CommentCommand(),
    "#": new CommentCommand(),
    "!": new CommentCommand(),
    erstelle: new CreateCommand(),
    addiere: new AddCommand(),
  };

  public static run(sourceTree: AbstractSyntaxTree): string {
    let ret = "";

    if (sourceTree.command.toLowerCase() in CommandExecutor.COMMANDS) {
      try {
        ret += `${CommandExecutor.COMMANDS[
          sourceTree.command.toLowerCase()
        ].run(sourceTree)}`;
      } catch (e) {
        ret += "/* COMPILING ERROR */\n";
        ret += "/* --------------- */\n";
        ret += `/* ${e.message} */\n`;
        ret += `/* ${e.stack} */\n`;
        ret += `/* ${e.name} */\n`;
        ret += "/* --------------- */\n";
      }
    } else {
      ret += sourceTree.args.join(" ");
    }

    if (sourceTree.children.length > 0) {
      ret += " {\n";
      sourceTree.children.forEach((child) => {
        ret += CommandExecutor.run(child);
      });
      ret += "}\n";
    }

    return ret;
  }
}
