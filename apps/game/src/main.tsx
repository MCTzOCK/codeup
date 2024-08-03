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
import { SampleGame } from "./scenes/SampleGame";
import { UIManager } from "./ui/UIManager";
import "./simple-api/SimpleAPI";
import { PauseManager } from "./managers/PauseManager";
import * as ReactDOM from "react-dom/client";
import UIMainMenu from "./scenes/UIMainMenu";
import * as React from "react";
import Layout from "./ui/Layout";
import { TutorialScene } from "./scenes/TutorialScene";

UIManager.init();
PauseManager.init();

const g = await Game.createGame();

g.add("sampleGame", SampleGame);
g.add("tutorial", TutorialScene);

window.Game = Game;

const usp = new URLSearchParams(window.location.search);

if (usp.has("scene")) {
  g.goToScene(usp.get("scene"));
} else {
  const r = ReactDOM.createRoot(document.getElementById("menu-screen"));
  r.render(
    <Layout>
      <UIMainMenu />
    </Layout>
  );
}
