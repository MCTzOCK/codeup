/**
 * apps/game/src/assets/resources.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as ex from "excalibur";

export const Resources = {
  Logo: new ex.ImageSource("/assets/codeup.png"),
} as const;

export const loader = new ex.Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
