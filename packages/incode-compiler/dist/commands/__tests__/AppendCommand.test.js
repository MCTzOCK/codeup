"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/AppendCommand.test.ts
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
describe("Hinzufügen", function () {
    test("Zum Bildschirm", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Füge x zum Bildschirm hinzu")[0])).toBe("document.body.appendChild(x);");
    });
    test("Zu Element", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate("Füge x zu y hinzu")[0])).toBe("y.appendChild(x);");
    });
});
//# sourceMappingURL=AppendCommand.test.js.map