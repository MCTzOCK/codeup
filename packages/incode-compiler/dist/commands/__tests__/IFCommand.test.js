"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/IFCommand.test.ts
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
describe("Abfragen", function () {
    test("Wenn (einzelne Bedingung)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Wenn x größer 0 ist\n\tGib "Hallo Welt" in der Dialogbox aus')[0])).toBe('if(x > 0) {\nalert("Hallo Welt");}\n');
    });
    test("Wenn (mehrfache Bedingungen)", function () {
        expect(CommandExecutor_1.default.run(incode_ast_generator_1.AbstractSyntaxTreeGenerator.generate('Wenn x größer 0 ist und x kleiner y ist oder z größer 0\n\tGib "Hallo Welt" in der Dialogbox aus')[0])).toBe('if(x > 0 && x < y || z > 0) {\nalert("Hallo Welt");}\n');
    });
});
//# sourceMappingURL=IFCommand.test.js.map