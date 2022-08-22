/**
 * packages/incode-ast-generator/util/PreCompiler.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */

// THIS CODE SNIPPET WAS ORIGINALLY CREATED BY BEN SIEBERT FOR THE INCODE PROGRAMMING LANGUAGE
//
//
// Original: https://github.com/InCodeDevs/InCode/blob/63f73726d0a02a96a023e0ec81aef3504ffe4f1d/packages/compiler/src/util/PreCompiler.ts#L6
// Copyright © Ben Siebert

export class PreCompiler {
  public static preCompile(source: string): string {
    source = source.replace(/ {2}/g, "");
    source = source.replace(/\r/g, "");
    return source;
  }
}
