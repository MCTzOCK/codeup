/**
 * apps/game/src/actors/Character.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.08.2024
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
import { Resources } from "../resources";

export class Character extends CActor {
  public SPEED = 0.75;
  public LIVES = 3;

  constructor(config?: ActorArgs) {
    super(config);
    const s = Resources.Character.toSprite();
    this.anchor = Vector.Zero;

    s.destSize = {
      width: 128,
      height: 256,
    };
    this.graphics.use(s);
  }
  update(engine: Engine, delta: number) {
    super.update(engine, delta);
  }
}
