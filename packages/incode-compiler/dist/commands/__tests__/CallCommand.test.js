"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/CallCommand.test.ts
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
describe("Funktion Aufruf", function () {
    test("Aufruf", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("rufe x1 auf")[0])).toBe("x1();");
    });
});
//# sourceMappingURL=CallCommand.test.js.map