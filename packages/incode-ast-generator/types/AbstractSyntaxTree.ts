/**
 * packages/incode-ast-generator/types/AbstractSyntaxTree.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 */

// THIS CODE SNIPPET WAS ORIGINALLY CREATED BY BEN SIEBERT FOR THE INCODE PROGRAMMING LANGUAGE
//
//
// Original: https://github.com/InCodeDevs/InCode/blob/63f73726d0a02a96a023e0ec81aef3504ffe4f1d/packages/compiler/src/types/AbstractSyntaxTree.ts#L6
// Copyright © Ben Siebert

export interface AbstractSyntaxTree {
  command: string;
  intents: number;
  children: AbstractSyntaxTree[];
  args: string[];
}
