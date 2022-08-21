/**
 * packages/incode-compiler/src/commands/__tests__/CreateCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Erstellen", () => {
  test("Variable", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Erstelle x als Variable")[0]
      )
    ).toBe("let x = null;");
  });

  test("Variable mit Wert (Text)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Erstelle x als Variable mit dem Wert "Hallo Welt"'
        )[0]
      )
    ).toBe('let x = "Hallo Welt";');
  });

  test("Variable mit Wert (Zahl)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          "Erstelle x als Variable mit dem Wert 42"
        )[0]
      )
    ).toBe("let x = 42;");
  });

  test("Element (Knopf)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Erstelle x als Knopf")[0]
      )
    ).toBe('let x = document.createElement("button");');
  });

  test("Element (Text)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Erstelle x als Text")[0]
      )
    ).toBe('let x = document.createElement("span");');
  });
});
