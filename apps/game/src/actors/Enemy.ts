/**
 * apps/game/src/actors/Enemy.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import { Engine, Actor, ActorArgs } from "excalibur";
import { Player } from "./Player";
import { PauseManager } from "../managers/PauseManager";
import { CActor } from "../extends/CActor";

export class Enemy extends CActor {
  public SPEED = 0.25;

  constructor(config?: ActorArgs) {
    super(config);
  }

  update(engine: Engine, delta: number) {
    if (PauseManager.isPaused()) return;
    let pos = undefined;
    engine.currentScene.actors.map((actor) => {
      if (actor instanceof Actor && actor instanceof Player) {
        pos = actor.pos;
      }
    });

    if (pos === undefined) return;

    const diff = pos.sub(this.pos).normalize();

    this.pos.x += diff.x * this.SPEED * delta;
    this.pos.y += diff.y * this.SPEED * delta;
  }
}
