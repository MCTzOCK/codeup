"use strict";
/**
 * packages/incode-compiler/src/commands/tests/SubtractCommand.test.ts
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
describe("Subtrahieren", function () {
    test("Zahl Subtrahieren", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Subtrahiere 1 von x")[0])).toBe("x -= 1;");
    });
    test("Variable Subtrahieren", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Subtrahiere y von x")[0])).toBe("x -= y;");
    });
});
//# sourceMappingURL=SubtractCommand.test.js.map