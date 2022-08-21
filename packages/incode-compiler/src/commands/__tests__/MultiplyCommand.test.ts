/**
 * packages/incode-compiler/src/commands/tests/MultiplyCommand.test.ts
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

describe("Multiplizieren", () => {
  test("Zahl Multiplizieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Multipliziere x mit 1")[0]
      )
    ).toBe("x *= 1;");
  });

  test("Variable Multiplizieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Multipliziere x mit y")[0]
      )
    ).toBe("x *= y;");
  });
});
