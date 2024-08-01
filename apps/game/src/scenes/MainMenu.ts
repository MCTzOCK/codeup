/**
 * apps/game/src/scenes/MainMenu.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import { Color, Engine, Input, Scene, Vector } from "excalibur";
import { Player } from "../actors/Player";
import { Enemy } from "../actors/Enemy";
import { PauseManager } from "../managers/PauseManager";
import { CActor } from "../extends/CActor";

export class MainMenu extends Scene {
  constructor() {
    super();
  }

  onInitialize(engine: Engine) {
    PauseManager.init();
    super.onInitialize(engine);

    const player = new Player({
      x: 100,
      y: 500,
      width: 80,
      height: 80,
      color: Color.Red,
    });

    this.add(player);

    this.add(
      new Enemy({
        pos: new Vector(100, 100),
        width: 80,
        height: 80,
        color: Color.Blue,
      })
    );
  }
}
