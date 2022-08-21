/**
 * packages/incode-compiler/src/commands/tests/AddCommand.test.ts
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

describe("Addieren", () => {
  test("Zahl Addieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Addiere 1 zu x")[0]
      )
    ).toBe("x += 1;");
  });

  test("Variable Addieren", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Addiere y zu x")[0]
      )
    ).toBe("x += y;");
  });
});
