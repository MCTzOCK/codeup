/**
 * packages/incode-compiler/src/commands/__tests__/PrintCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Ausgabe", () => {
  test("Ausgabe (Konsole)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Gib "Hallo Welt" in der Konsole aus'
        )[0]
      )
    ).toBe('console.log("Hallo Welt");');
  });

  test("Ausgabe (Dialogbox)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Gib "Hallo Welt" in der Dialogbox aus'
        )[0]
      )
    ).toBe('alert("Hallo Welt");');
  });

  test("Ausgabe (Custom)", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Gib "Hallo Welt" in der myCustomFunction aus'
        )[0]
      )
    ).toBe('myCustomFunction("Hallo Welt");');
  });
});
