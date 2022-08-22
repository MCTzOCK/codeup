"use strict";
/**
 * packages/incode-compiler/src/commands/tests/CommentCommand.test.ts
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
describe("Kommentare", function () {
    test("# Kommentar", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("# Test")[0])).toBe("//Test");
    });
    test("// Kommentar", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("// Test")[0])).toBe("//Test");
    });
    test("! Kommentar", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("! Test")[0])).toBe("//Test");
    });
});
//# sourceMappingURL=CommentCommand.test.js.map