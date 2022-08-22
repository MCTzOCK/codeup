"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/PrintCommand.test.ts
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
describe("Ausgabe", function () {
    test("Ausgabe (Konsole)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Gib "Hallo Welt" in der Konsole aus')[0])).toBe('console.log("Hallo Welt");');
    });
    test("Ausgabe (Dialogbox)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Gib "Hallo Welt" in der Dialogbox aus')[0])).toBe('alert("Hallo Welt");');
    });
    test("Ausgabe (Custom)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Gib "Hallo Welt" in der myCustomFunction aus')[0])).toBe('myCustomFunction("Hallo Welt");');
    });
});
//# sourceMappingURL=PrintCommand.test.js.map