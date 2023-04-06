/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AbstractSyntaxTree } from "../types/AbstractSyntaxTree";
import { AbstractSyntaxTreeGenerator } from "./AbstractSyntaxTreeGenerator";
import { CommandExecutor } from "./commands/CommandExecutor";
import { js_beautify as beautify } from "js-beautify";
import { PreCompiler } from "../util/PreCompiler";

export class Compiler {
  public static compile(source: string | AbstractSyntaxTree[]): string {
    if (typeof source === "string") {
      source = PreCompiler.preCompile(source);
    }
    let ast: AbstractSyntaxTree[] = [];
    if (typeof source === "string") {
      ast = AbstractSyntaxTreeGenerator.generate(source);
    }

    let code = `/**
 * @generator InCode
 * @version 2.x
 */\nwindow.incode = {};\n(async () => {\n\n`;

    ast.forEach((node) => {
      code += "\n" + CommandExecutor.executeCommand(node) + "\n";
    });
    code += "\n})();";

    code = code.replace(/\n\n/g, "");

    return beautify(code, {
      indent_char: " ",
      indent_size: 2,
    });
  }
}
