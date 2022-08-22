"use strict";
/**
 * packages/incode-compiler/src/commands/__tests__/FunctionCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var x = "\nFunktion hallo\n\tGib \"Hallo Welt\" in der myFunction aus\n\tGib \"Hallo Welt\" in der Konsole aus\n\tFunktion hallo2\n\t\tGib \"Hallo Welt\" in der myFunction aus\n\t\tGib \"Hallo Welt\" in der Konsole aus\n\tFrage \"Hallo Welt\" und speicher die Antwort in x\nGib \"Hallo Welt\" in der Dialogbox aus\n";
describe("Funktionen", function () {
    test("Funktion", function () {
        expect((0, index_1.compile)(x, false)).toBe("window.onload = async () => {\n" +
            "    await window.codeup.run()\n" +
            "};\n" +
            "window.codeup = {\n" +
            "    run: async () => {\n" +
            "        function hallo() {\n" +
            '            myFunction("Hallo Welt");\n' +
            '            console.log("Hallo Welt");\n' +
            "\n" +
            "            function hallo2() {\n" +
            '                myFunction("Hallo Welt");\n' +
            '                console.log("Hallo Welt");\n' +
            "            }\n" +
            '            let x = prompt("Hallo Welt");\n' +
            "        }\n" +
            '        alert("Hallo Welt");\n' +
            "    }\n" +
            "}");
    });
});
//# sourceMappingURL=FunctionCommand.test.js.map