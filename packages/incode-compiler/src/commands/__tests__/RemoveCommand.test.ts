/**
 * packages/incode-compiler/src/commands/__tests__/RemoveCommand.test.ts
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

describe("Entfernen", () => {
  test("Vom Bildschirm", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Entferne x vom Bildschirm")[0]
      )
    ).toBe("document.body.removeChild(x);");
  });
  test("Vom Element", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Entferne x von y")[0]
      )
    ).toBe("y.removeChild(x);");
  });
});
