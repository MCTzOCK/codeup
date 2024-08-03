/**
 * apps/game/src/scenes/TutorialScene.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.08.2024
 *
 */
import { Color, Engine, IsometricMap, Scene, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { Character } from "../actors/Character";

export class TutorialScene extends Scene {
  constructor() {
    super();
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    const isoMap = new IsometricMap({
      pos: vec(engine.drawWidth / 2, 0),
      tileWidth: 128,
      tileHeight: 64,
      columns: 15,
      rows: 15,
    });

    const sprite = Resources.MCDirt.toSprite();

    sprite.destSize = {
      width: 128,
      height: 128,
    };

    for (const tile of isoMap.tiles) {
      tile.addGraphic(sprite);
      tile.solid = true;
    }

    isoMap.transform.z = -1;

    const c = new Character({
      width: 128,
      height: 256,
      anchor: Vector.Zero,
      x: isoMap.tileToWorld(vec(5, 5)).x,
      y: isoMap.tileToWorld(vec(5, 5)).y,
      color: Color.Red,
    });

    c.z = 150;

    this.add(c);

    this.add(isoMap);
    this.camera.strategy.elasticToActor(c, 0.1, 0.1);
  }
}
