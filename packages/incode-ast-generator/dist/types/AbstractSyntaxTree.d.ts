/**
 * packages/incode-ast-generator/types/AbstractSyntaxTree.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 */
export interface AbstractSyntaxTree {
    command: string;
    intents: number;
    children: AbstractSyntaxTree[];
    args: string[];
}
