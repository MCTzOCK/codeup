"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/AskCommand.test.ts
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
describe("Fragen", function () {
    test("Frage", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Frage "Hallo Welt" und speicher die Antwort in x')[0])).toBe('let x = prompt("Hallo Welt");');
    });
});
//# sourceMappingURL=AskCommand.test.js.map