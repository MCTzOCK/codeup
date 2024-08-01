/**
 * apps/game/src/Game.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import { Color, DisplayMode, Engine, Flags } from "excalibur";

export class Game {
  public static _instance: Engine;

  public static async createGame(): Promise<Engine> {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Engine({
      backgroundColor: Color.Black,
      displayMode: DisplayMode.FillScreen,
      canvasElement: this.getCanvasElement(),
    });

    await this._instance.start();

    return this._instance;
  }

  public static getCanvasElement(): HTMLCanvasElement {
    if ([null, undefined].includes(document.getElementById("game"))) {
      const canvas = document.createElement("canvas");
      canvas.id = "game";
      document.body.appendChild(canvas);
    }

    return document.getElementById("game") as HTMLCanvasElement;
  }
}
