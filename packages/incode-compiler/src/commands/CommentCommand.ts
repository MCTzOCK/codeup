/**
 * packages/incode-compiler/src/commands/CommentCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export default class CommentCommand implements Command {
  run(sourceTree: AbstractSyntaxTree): string {
    return `//${sourceTree.args.join(" ")}`;
  }
}
