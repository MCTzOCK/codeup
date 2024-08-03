/**
 * apps/game/src/engine.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.08.2024
 *
 */

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById("game") as HTMLCanvasElement;

    if (!this.canvas) {
      return;
    }

    this.canvas.style.width = "100%";
    this.canvas.style.height = "100vh";
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx = this.canvas.getContext("2d");

    this.start();
  }

  public start() {
    setInterval(() => {
      this.loop();
    }, 1000 / 60); // 60 FPS
  }

  public loop() {
    // create an isometric map
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // create an isometric map in the middle of the screen
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(
      this.canvas.width / 2 - 300,
      this.canvas.height / 2 - 300,
      600,
      600
    );
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(
      this.canvas.width / 2 - 250,
      this.canvas.height / 2 - 250,
      500,
      500
    );
  }

  public randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}
