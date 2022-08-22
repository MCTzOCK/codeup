/**
 * packages/incode-compiler/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */
import { AbstractSyntaxTree } from "@codeup/incode-ast-generator";
import CommandExecutor from "./CommandExecutor";
import { Command } from "./types/Command";
export declare function compile(source: string | AbstractSyntaxTree[], minify?: boolean): string;
export { CommandExecutor, Command };
