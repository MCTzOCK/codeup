/**
 * packages/incode-compiler/src/commands/tests/DivideCommand.test.ts
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

describe("Dividieren", () => {
  test("Zahl Dividieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Dividiere x durch 1")[0]
      )
    ).toBe("x /= 1;");
  });

  test("Variable Dividieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Dividiere x durch y")[0]
      )
    ).toBe("x /= y;");
  });
});
