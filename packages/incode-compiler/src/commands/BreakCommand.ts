/**
 * packages/incode-compiler/src/commands/BreakCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
import { Command } from "../types/Command";

export default class BreakCommand implements Command {
  /*
   * Break Command
   *
   * Usage: Stopp
   */
  run(sourceTree: AbstractSyntaxTree): string {
    return "break;";
  }
}
