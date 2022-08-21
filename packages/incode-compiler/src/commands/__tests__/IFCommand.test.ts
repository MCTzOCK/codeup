/**
 * packages/incode-compiler/src/commands/__tests__/IFCommand.test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.08.2022
 *
 */

import CommandExecutor from "../../CommandExecutor";
import { AbstractSyntaxTreeGenerator } from "@codeup/incode-ast-generator";

describe("Abfragen", function () {
  test("Wenn (einzelne Bedingung)", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Wenn x größer 0 ist\n\tGib "Hallo Welt" in der Dialogbox aus'
        )[0]
      )
    ).toBe('if(x > 0) {\nalert("Hallo Welt");}\n');
  });

  test("Wenn (mehrfache Bedingungen)", function () {
    expect(
      CommandExecutor.run(
        AbstractSyntaxTreeGenerator.generate(
          'Wenn x größer 0 ist und x kleiner y ist oder z größer 0\n\tGib "Hallo Welt" in der Dialogbox aus'
        )[0]
      )
    ).toBe('if(x > 0 && x < y || z > 0) {\nalert("Hallo Welt");}\n');
  });
});
