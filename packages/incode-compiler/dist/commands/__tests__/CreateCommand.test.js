"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/CreateCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CommandExecutor_1 = require("../../CommandExecutor");
var incode_ast_generator_1 = require("@codeup/incode-ast-generator");
describe("Erstellen", function () {
    test("Variable", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Erstelle x als Variable")[0])).toBe("let x = null;");
    });
    test("Variable mit Wert (Text)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Erstelle x als Variable mit dem Wert "Hallo Welt"')[0])).toBe('let x = "Hallo Welt";');
    });
    test("Variable mit Wert (Zahl)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Erstelle x als Variable mit dem Wert 42")[0])).toBe("let x = 42;");
    });
    test("Element (Knopf)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Erstelle x als Knopf")[0])).toBe('let x = document.createElement("button");');
    });
    test("Element (Text)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Erstelle x als Text")[0])).toBe('let x = document.createElement("span");');
    });
});
//# sourceMappingURL=CreateCommand.test.js.map