"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/RemoveCommand.test.ts
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
describe("Entfernen", function () {
    test("Vom Bildschirm", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Entferne x vom Bildschirm")[0])).toBe("document.body.removeChild(x);");
    });
    test("Vom Element", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Entferne x von y")[0])).toBe("y.removeChild(x);");
    });
});
//# sourceMappingURL=RemoveCommand.test.js.map