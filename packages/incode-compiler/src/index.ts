/**
 * packages/incode-compiler/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */

import {
  AbstractSyntaxTree,
  AbstractSyntaxTreeGenerator,
} from "@codeup/incode-ast-generator";
import * as UglifyJS from "uglify-js";
import CommandExecutor from "./CommandExecutor";
import { Command } from "./types/Command";
import * as js_beautify from "js-beautify";

export function compile(
  source: string | AbstractSyntaxTree[],
  minify: boolean = false
): string {
  let code = "";
  code +=
    "window.onload=async()=>{await window.codeup.run()};window.codeup={run:async()=>{";

  let ast: AbstractSyntaxTree[];

  if (typeof source === "string") {
    ast = AbstractSyntaxTreeGenerator.generate(source);
  } else {
    ast = source;
  }

  ast.forEach((node) => {
    if (node.command.trim() !== "") {
      code += CommandExecutor.run(node);
    }
  });

  code += "}}";

  if (minify) {
    return UglifyJS.minify(code, {
      mangle: true,
      output: {
        ascii_only: true,
      },
    }).code;
  }
  return js_beautify.js_beautify(code);
}

export { CommandExecutor, Command };
