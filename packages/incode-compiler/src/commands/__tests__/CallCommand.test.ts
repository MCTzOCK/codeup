/**
 * packages/incode-compiler/src/commands/__tests__/CallCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Funktion Aufruf", () => {
  test("Aufruf", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("rufe x1 auf")[0]
      )
    ).toBe("x1();");
  });
});
