/**
 * packages/incode-compiler/src/commands/__tests__/AskCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Fragen", function () {
  test("Frage", () => {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Frage "Hallo Welt" und speicher die Antwort in x'
        )[0]
      )
    ).toBe('let x = prompt("Hallo Welt");');
  });
});
