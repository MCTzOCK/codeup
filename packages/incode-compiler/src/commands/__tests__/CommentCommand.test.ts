/**
 * packages/incode-compiler/src/commands/tests/CommentCommand.test.ts
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

describe("Kommentare", () => {
  test("# Kommentar", () => {
    expect(
      CommandExecutor.run(AbstractSyntaxTreeGenerator.generate("# Test")[0])
    ).toBe("//Test");
  });

  test("// Kommentar", () => {
    expect(
      CommandExecutor.run(AbstractSyntaxTreeGenerator.generate("// Test")[0])
    ).toBe("//Test");
  });

  test("! Kommentar", () => {
    expect(
      CommandExecutor.run(AbstractSyntaxTreeGenerator.generate("! Test")[0])
    ).toBe("//Test");
  });
});
