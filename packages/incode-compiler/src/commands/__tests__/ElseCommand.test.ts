/**
 * packages/incode-compiler/src/commands/__tests__/ElseCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Sonst", function () {
  test("Sonst", function () {
    expect(
      CommandExecutor.run(AbstractSyntaxTreeGenerator.generate("Sonst")[0])
    ).toBe("else");
  });
  test("Sonst Wenn (einzelne Bedingung)", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Sonst Wenn x gleich 2 ist")[0]
      )
    ).toBe("else if(x == 2)");
  });
  test("Sonst Wenn (mehrere Bedingungen)", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          "Sonst Wenn x gleich 2 ist und x kleiner y ist und y größer 3 ist"
        )[0]
      )
    ).toBe("else if(x == 2 && x < y && y > 3)");
  });
});
