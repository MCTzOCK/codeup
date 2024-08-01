/**
 * apps/game/src/main.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import { Game } from "./Game";
import { MainMenu } from "./scenes/MainMenu";
import { UIManager } from "./ui/UIManager";
import "./simple-api/SimpleAPI";

UIManager.init();

const g = await Game.createGame();

g.add("mainMenu", MainMenu);

g.goToScene("mainMenu");

window.Game = Game;
