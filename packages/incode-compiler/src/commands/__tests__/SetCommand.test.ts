/**
 * packages/incode-compiler/src/commands/__tests__/SetCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Setzen", function () {
  test("Wert Setzen", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Setze den Wert von x auf 1")[0]
      )
    ).toBe("x = 1;");
  });
  test("Text Setzen", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Setze den Text von x auf "Hallo World"'
        )[0]
      )
    ).toBe('x.innerText = "Hallo World";');
  });
  test("Farbe Setzen", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          "Setze die Farbe von x auf #FF0000"
        )[0]
      )
    ).toBe('x.style.color = "#FF0000";');
  });
});
