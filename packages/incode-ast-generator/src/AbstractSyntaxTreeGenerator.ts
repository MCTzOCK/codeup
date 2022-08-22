/**
 * packages/incode-ast-generator/AbstractSyntaxTreeGenerator.ts
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
// Original: https://github.com/InCodeDevs/InCode/blob/63f73726d0a02a96a023e0ec81aef3504ffe4f1d/packages/compiler/src/module/AbstractSyntaxTreeGenerator.ts#L5
// Copyright © Ben Siebert

import { AbstractSyntaxTree } from "./types/AbstractSyntaxTree";
import { PreCompiler } from "./util/PreCompiler";

export class AbstractSyntaxTreeGenerator {
  public static generate(source: string): AbstractSyntaxTree[] {
    source = PreCompiler.preCompile(source);
    const lines = source.split("\n");

    if (lines.length === 0) {
      return [];
    }

    const words: string[][] = this.splitWords(source);

    let result: AbstractSyntaxTree[];

    let temp: AbstractSyntaxTree[] = [];

    words.forEach((wordList) => {
      if (wordList.length === 0) {
        return;
      }

      const ast: AbstractSyntaxTree = {
        intents: 0,
        command: "",
        args: [],
        children: [],
      };

      const firstWord = wordList[0];

      ast.intents = firstWord.split("\t").length - 1;
      ast.command = firstWord.replace(/\t/g, "");
      ast.args = wordList.slice(1);

      temp.push(ast);
    });

    temp.forEach((ast) => {
      if (ast.intents === 0) {
        temp.push(ast);
        return;
      }
      if (temp[temp.length - 1].intents === ast.intents - 1) {
        temp[temp.length - 1].children.push(ast);
        return;
      } else {
        let x =
          temp[temp.length - 1].children[
            temp[temp.length - 1].children.length - 1
          ];
        let y = x;
        while (
          x !== null &&
          x.intents !== ast.intents - 1 &&
          x.intents !== ast.intents
        ) {
          x = y.children[y.children.length - 1];
          y = x;
        }
        if (x.intents === ast.intents - 1) {
          x.children.push(ast);
        } else {
          y.children.push(ast);
        }
      }
    });

    temp = temp.filter((t) => t.intents === 0);

    temp = Array.from(new Set(temp.map((a) => a))).map((a0) => {
      return temp.find((a) => a === a0);
    }) as AbstractSyntaxTree[];

    result = temp;

    return result;
  }

  private static splitWords(source: string): string[][] {
    const matrix: string[][] = [];

    const lines = source.split("\n");
    lines.forEach((line) => {
      if (line.match(/(["'])(?:(?=(\\?))\2.)*?\1/g)) {
        const quotes = line.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
        (quotes as string[]).forEach((quote) => {
          line = line.replace(quote, quote.split(" ").join("\0"));
        });
      }
      matrix.push(line.split(" "));
    });

    return matrix;
  }
}
