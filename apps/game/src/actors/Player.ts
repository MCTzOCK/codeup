/**
 * apps/game/src/actors/Player.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import {
  Engine,
  Actor,
  Input,
  Color,
  Vector,
  ActorArgs,
  Collider,
  Side,
  CollisionContact,
} from "excalibur";
import { PauseManager } from "../managers/PauseManager";
import { CActor } from "../extends/CActor";
import { Enemy } from "./Enemy";

export class Player extends CActor {
  public SPEED = 0.75;
  public LIVES = 3;

  constructor(config?: ActorArgs) {
    super(config);
    this.name = "PLAYER";
  }

  onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ) {
    super.onCollisionStart(self, other, side, contact);
    if (other.owner instanceof Enemy) {
      this.LIVES -= 1;
      if (this.LIVES <= 0) {
        alert("Game Over!");
      }
    }
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);
    if (PauseManager.isPaused()) return;
    if (engine.input.keyboard.isHeld(Input.Keys.Left) && this.pos.x > 0) {
      this.pos.x -= 1.5 * this.SPEED * delta;
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.Right) &&
      this.pos.x < engine.drawWidth
    ) {
      this.pos.x += 1.5 * this.SPEED * delta;
    }
    if (engine.input.keyboard.isHeld(Input.Keys.Up) && this.pos.y > 0) {
      this.pos.y -= 1.5 * this.SPEED * delta;
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.Down) &&
      this.pos.y < engine.drawHeight
    ) {
      this.pos.y += 1.5 * this.SPEED * delta;
    }
  }
}
