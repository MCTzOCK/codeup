/**
 * packages/incode-compiler/src/test.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.08.2022
 *
 */

import * as x from "./index";

console.log(
  x.compile(
    "Erstelle x als Variable mit dem Wert 42\nSubtrahiere 2 von x\nAddiere 2 zu x",
    false
  )
);
