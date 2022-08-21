/**
 * packages/incode-compiler/src/types/Command.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.08.2022
 *
 */
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";

export interface Command {
  run: (sourceTree: AbstractSyntaxTree) => string;
}
