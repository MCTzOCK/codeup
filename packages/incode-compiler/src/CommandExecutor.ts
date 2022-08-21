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
import SubtractCommand from "./commands/SubtractCommand";
import MultiplyCommand from "./commands/MultiplyCommand";
import DivideCommand from "./commands/DivideCommand";
import AppendCommand from "./commands/AppendCommand";
import RemoveCommand from "./commands/RemoveCommand";
import PrintCommand from "./commands/PrintCommand";
import AskCommand from "./commands/AskCommand";
import FunctionCommand from "./commands/FunctionCommand";
import CallCommand from "./commands/CallCommand";
import SetCommand from "./commands/SetCommand";
import RepeatCommand from "./commands/RepeatCommand";
import IFCommand from "./commands/IFCommand";

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
    subtrahiere: new SubtractCommand(),
    multipliziere: new MultiplyCommand(),
    dividiere: new DivideCommand(),
    füge: new AppendCommand(),
    entferne: new RemoveCommand(),
    gib: new PrintCommand(),
    frage: new AskCommand(),
    funktion: new FunctionCommand(),
    rufe: new CallCommand(),
    setze: new SetCommand(),
    wiederhole: new RepeatCommand(),
    wenn: new IFCommand(),
  };

  public static run(sourceTree: AbstractSyntaxTree): string {
    let ret = "";

    try {
      if (sourceTree.command.toLowerCase() in CommandExecutor.COMMANDS) {
        ret += `${CommandExecutor.COMMANDS[
          sourceTree.command.toLowerCase()
        ].run(sourceTree)}`;
      } else {
        throw new Error(`Command ${sourceTree.command} not found`);
      }
    } catch (e) {
      ret += "/* COMPILING ERROR */\n";
      ret += "/* --------------- */\n";
      ret += `/* ${e.message} */\n`;
      ret += `/* ${e.stack} */\n`;
      ret += `/* ${e.name} */\n`;
      ret += "/* --------------- */\n";
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
