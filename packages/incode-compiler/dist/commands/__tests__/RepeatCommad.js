"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/RepeatCommad.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var incode_ast_generator_1 = require("@codeup/incode-ast-generator");
describe("Wiederholen", function () {
    test("FOR-Schleife", function () {
        var output = index_1.CommandExecutor.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Wiederhole 10 mal")[0]);
        expect(output).toContain("= 0;");
        expect(output).toContain("< 10;");
        expect(output).toContain("++");
    });
    test("WHILE-Schleife", function () {
        expect(index_1.CommandExecutor.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Wiederhole solange x kleiner y ist")[0])).toBe("while(x < y)");
    });
    test("WHILE-Schleife (mehrere Bedingungen)", function () {
        expect(index_1.CommandExecutor.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Wiederhole solange x kleiner y ist und x größer 0 ist und y kleiner 10 ist")[0])).toBe("while(x < y && x > 0 && y < 10)");
    });
});
//# sourceMappingURL=RepeatCommad.js.map