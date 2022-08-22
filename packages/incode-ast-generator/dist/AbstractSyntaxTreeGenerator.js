"use strict";
/**
 * packages/incode-ast-generator/AbstractSyntaxTreeGenerator.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSyntaxTreeGenerator = void 0;
var PreCompiler_1 = require("./util/PreCompiler");
var AbstractSyntaxTreeGenerator = /** @class */ (function () {
    function AbstractSyntaxTreeGenerator() {
    }
    AbstractSyntaxTreeGenerator.generate = function (source) {
        source = PreCompiler_1.PreCompiler.preCompile(source);
        var lines = source.split("\n");
        if (lines.length === 0) {
            return [];
        }
        var words = this.splitWords(source);
        var result;
        var temp = [];
        words.forEach(function (wordList) {
            if (wordList.length === 0) {
                return;
            }
            var ast = {
                intents: 0,
                command: "",
                args: [],
                children: [],
            };
            var firstWord = wordList[0];
            ast.intents = firstWord.split("    ").length - 1;
            ast.command = firstWord.replace(/ {4}/g, "");
            ast.args = wordList.slice(1);
            temp.push(ast);
        });
        temp.forEach(function (ast) {
            if (ast.intents === 0) {
                temp.push(ast);
                return;
            }
            if (temp[temp.length - 1].intents === ast.intents - 1) {
                temp[temp.length - 1].children.push(ast);
                return;
            }
            else {
                var x = temp[temp.length - 1].children[temp[temp.length - 1].children.length - 1];
                var y = x;
                while (x !== null &&
                    x.intents !== ast.intents - 1 &&
                    x.intents !== ast.intents) {
                    x = y.children[y.children.length - 1];
                    y = x;
                }
                if (x.intents === ast.intents - 1) {
                    x.children.push(ast);
                }
                else {
                    y.children.push(ast);
                }
            }
        });
        temp = temp.filter(function (t) { return t.intents === 0; });
        temp = Array.from(new Set(temp.map(function (a) { return a; }))).map(function (a0) {
            return temp.find(function (a) { return a === a0; });
        });
        result = temp;
        return result;
    };
    AbstractSyntaxTreeGenerator.splitWords = function (source) {
        var matrix = [];
        var lines = source.split("\n");
        lines.forEach(function (line) {
            if (line.match(/(["'])(?:(?=(\\?))\2.)*?\1/g)) {
                var quotes = line.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
                quotes.forEach(function (quote) {
                    line = line.replace(quote, quote.split(" ").join("\0"));
                });
            }
            matrix.push(line.split(" "));
        });
        return matrix;
    };
    return AbstractSyntaxTreeGenerator;
}());
exports.AbstractSyntaxTreeGenerator = AbstractSyntaxTreeGenerator;
//# sourceMappingURL=AbstractSyntaxTreeGenerator.js.map