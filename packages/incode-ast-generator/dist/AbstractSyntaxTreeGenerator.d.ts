/**
 * packages/incode-ast-generator/AbstractSyntaxTreeGenerator.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */
import { AbstractSyntaxTree } from "./types/AbstractSyntaxTree";
export declare class AbstractSyntaxTreeGenerator {
    static generate(source: string): AbstractSyntaxTree[];
    private static splitWords;
}
