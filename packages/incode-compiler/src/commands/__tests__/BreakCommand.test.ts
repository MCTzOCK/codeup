/**
 * packages/incode-compiler/src/commands/__tests__/BreakCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Stopp", function () {
  test("break", () => {
    expect(
      CommandExecutor.run(AbstractSyntaxTreeGenerator.generate("Stopp")[0])
    ).toBe("break;");
  });
});
