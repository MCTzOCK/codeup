/**
 * packages/incode-compiler/src/commands/__tests__/FunctionCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";
import { compile } from "../../index";

let x = `
Funktion hallo
\tGib "Hallo Welt" in der myFunction aus
\tGib "Hallo Welt" in der Konsole aus
\tFunktion hallo2
\t\tGib "Hallo Welt" in der myFunction aus
\t\tGib "Hallo Welt" in der Konsole aus
\tFrage "Hallo Welt" und speicher die Antwort in x
Gib "Hallo Welt" in der Dialogbox aus
`;

describe("Funktionen", function () {
  test("Funktion", () => {
    expect(compile(x, false)).toBe(
      "window.onload = async () => {\n" +
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
        "}"
    );
  });
});
