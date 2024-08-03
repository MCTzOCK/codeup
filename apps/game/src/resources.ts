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
import { CLoader } from "./extends/CLoader";

export const Resources = {
  Logo: new ex.ImageSource("/assets/codeup.png"),
  MenuBackground: new ex.ImageSource("/assets/menu_background.png"),
  MCDirt: new ex.ImageSource("/assets/dirt-test.png"),
  Character: new ex.ImageSource("/assets/character-1.png"),
} as const;

export const loader = new CLoader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
