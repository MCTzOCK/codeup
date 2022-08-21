/**
 * packages/incode-compiler/src/commands/tests/SubtractCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import { compile } from "../../index";
import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Subtrahieren", () => {
  test("Zahl Subtrahieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Subtrahiere 1 von x")[0]
      )
    ).toBe("x -= 1;");
  });

  test("Variable Subtrahieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Subtrahiere y von x")[0]
      )
    ).toBe("x -= y;");
  });
});
