/**
 * apps/game/src/extends/CActor.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import {
  Actor,
  ActorArgs,
  Color,
  Engine,
  ExcaliburGraphicsContextWebGL,
  Font,
  Text,
  Vector,
} from "excalibur";
import { PauseManager } from "../managers/PauseManager";
import { UIManager } from "../ui/UIManager";
import Test from "../ui/Test";
import * as React from "react";
import EntityEditor from "../ui/EntityEditor";

export class CActor extends Actor {
  public devOverlay = false;

  constructor(config?: ActorArgs) {
    super(config);
    this.name = this.constructor.name + "#" + this.id;
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.on("pointerenter", () => {
      if (!PauseManager.isPaused()) return;
      this.openDevOverlay();
      document.body.style.cursor = "pointer";
    });

    this.on("pointerleave", () => {
      if (!PauseManager.isPaused()) return;
      this.closeDevOverlay();
      document.body.style.cursor = "default";
    });

    this.on("pointerdown", () => {
      if (!PauseManager.isPaused()) return;
      this.openDevEditor();
    });

    this.anchor.setTo(0, 0);
  }

  public openDevOverlay() {
    this.devOverlay = true;
    this.graphics.onPostDraw = (ctx: ExcaliburGraphicsContextWebGL) => {
      ctx.save();
      ctx.drawRectangle(
        new Vector(0, 0),
        this.width,
        this.height,
        Color.fromRGB(255, 0, 0, 0.25),
        Color.Red,
        2
      );

      const text = new Text({
        text: this.name,
        color: Color.White,
        font: new Font({
          size: 23,
          family: "Tahoma",
        }),
      });

      text.draw(ctx, 0, this.height + 10);

      ctx.restore();
    };
  }

  public closeDevOverlay() {
    this.devOverlay = false;
    this.graphics.onPostDraw = () => {};
  }

  public openDevEditor() {
    UIManager.render(<EntityEditor entityID={this.id} />);
  }
}
