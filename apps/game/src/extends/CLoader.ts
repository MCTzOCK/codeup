/**
 * apps/game/src/extends/CLoader.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as ex from "excalibur";
import { Color, Engine } from "excalibur";

export class CLoader extends ex.DefaultLoader {
  override onUpdate(engine: Engine, elapsedMilliseconds: number) {
    super.onUpdate(engine, elapsedMilliseconds);
  }

  override onDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Black.toRGBA();
    ctx.fillRect(
      0,
      0,
      this.engine.screen.resolution.width,
      this.engine.screen.resolution.height
    );

    ctx.save();
    ctx.translate(
      this.engine.screen.resolution.width / 2,
      this.engine.screen.resolution.height / 2
    );
    const speed = 1 * 10;
    ctx.strokeStyle = "#F7DE1F";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.arc(0, 0, 40, speed, speed + (Math.PI * 3) / 2);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    const text = (this.progress * 100).toFixed(0) + "%";
    const textbox = ctx.measureText(text);
    const width =
      Math.abs(textbox.actualBoundingBoxLeft) +
      Math.abs(textbox.actualBoundingBoxRight);
    const height =
      Math.abs(textbox.actualBoundingBoxAscent) +
      Math.abs(textbox.actualBoundingBoxDescent);
    ctx.fillText(text, -width / 2, height / 2); // center
    ctx.restore();
  }

  override async onUserAction(): Promise<void> {
    return super.onUserAction();
  }

  override async onBeforeLoad(): Promise<void> {
    return super.onBeforeLoad();
  }

  override async onAfterLoad(): Promise<void> {
    return super.onAfterLoad();
  }
}
