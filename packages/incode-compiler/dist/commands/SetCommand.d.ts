/**
 * packages/incode-compiler/src/commands/SetCommand.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
import { Command } from "../types/Command";
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
export default class SetCommand implements Command {
    static readonly colors: {
        name: string;
        aliases: string[];
    }[];
    static readonly data: {
        name: string;
        aliases: string[];
        type: string;
        append: string;
        values: {
            name: string;
            aliases: string[];
        }[];
    }[];
    run(sourceTree: AbstractSyntaxTree): string;
}
