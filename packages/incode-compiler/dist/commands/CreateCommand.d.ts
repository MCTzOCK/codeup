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
export default class CreateCommand implements Command {
    run(sourceTree: AbstractSyntaxTree): string;
}
