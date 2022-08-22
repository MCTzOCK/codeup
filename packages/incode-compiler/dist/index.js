"use strict";
/**
 * packages/incode-compiler/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExecutor = exports.compile = void 0;
var incode_ast_generator_1 = require("@codeup/incode-ast-generator");
var UglifyJS = require("uglify-js");
var CommandExecutor_1 = require("./CommandExecutor");
exports.CommandExecutor = CommandExecutor_1.default;
var js_beautify = require("js-beautify");
function compile(source, minify) {
    if (minify === void 0) { minify = false; }
    var code = "";
    code +=
        "window.onload=async()=>{await window.codeup.run()};window.codeup={run:async()=>{";
    var ast;
    if (typeof source === "string") {
        ast = incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate(source);
    }
    else {
        ast = source;
    }
    ast.forEach(function (node) {
        if (node.command.trim() !== "") {
            code += CommandExecutor_1.default.run(node);
        }
    });
    code += "}}";
    if (minify) {
        return UglifyJS.minify(code, {
            mangle: true,
            output: {
                ascii_only: true,
            },
        }).code;
    }
    return js_beautify.js_beautify(code);
}
exports.compile = compile;
//# sourceMappingURL=index.js.map