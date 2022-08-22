"use strict";
/**
 * packages/incode-compiler/src/commands/tests/MultiplyCommand.test.ts
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
describe("Multiplizieren", function () {
    test("Zahl Multiplizieren", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Multipliziere x mit 1")[0])).toBe("x *= 1;");
    });
    test("Variable Multiplizieren", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Multipliziere x mit y")[0])).toBe("x *= y;");
    });
});
//# sourceMappingURL=MultiplyCommand.test.js.map