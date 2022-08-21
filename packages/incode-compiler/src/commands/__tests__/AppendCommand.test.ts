/**
 * packages/incode-compiler/src/commands/__tests__/AppendCommand.test.ts
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

describe("Hinzufügen", () => {
  test("Zum Bildschirm", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Füge x zum Bildschirm hinzu")[0]
      )
    ).toBe("document.body.appendChild(x);");
  });
  test("Zu Element", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate("Füge x zu y hinzu")[0]
      )
    ).toBe("y.appendChild(x);");
  });
});
