/**
 * @author Ben Siebert <ben@mctzock.de>
 * @copyright (c) 2018-2021 Ben Siebert. All rights reserved.
 */
import { AbstractSyntaxTree } from "../types/AbstractSyntaxTree";

export class CodeGenerator {
  public static generate(ast: AbstractSyntaxTree[]): string {
    let code = "";

    ast.forEach((node) => {
      code += this.generateNode(node);
    });

    return code;
  }

  private static generateNode(node: AbstractSyntaxTree): string {
    let code = node.command + " " + node.args.join(" ").replace("\0", " ");

    for (let i = 0; i < node.intents; i++) {
      code = "\t" + code;
    }

    let addedLine = false;

    if (node.children.length > 0) {
      code += "\n";
      code += node.children.map((child) => this.generateNode(child)).join("");
      addedLine = true;
    }

    if (!addedLine) {
      code += "\n";
    }

    return code;
  }
}
