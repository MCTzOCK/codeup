/**
 * apps/game/src/managers/PauseManager.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import { Game } from "../Game";
import { CActor } from "../extends/CActor";
import { UIManager } from "../ui/UIManager";
import { Actor, Color, Font, Text, Vector } from "excalibur";
import { PDevMenu } from "../actors/PDevMenu";

export class PauseManager {
  public static paused = false;
  public static pausedText = new Text({
    text: "Pause / Dev Mode",
    color: Color.Azure,
    font: new Font({
      size: 23,
      family: "Tahoma",
    }),
  });
  public static readonly remove_after_resume = [
    "codeup.pause_text",
    "PDevMenu",
  ];

  public static init() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.paused) {
          this.resume();
        } else {
          this.pause();
        }
      }
    });
  }

  public static isPaused() {
    return this.paused;
  }

  public static pause() {
    this.paused = true;
    const a = new Actor({
      x: 20,
      y: Game._instance.currentScene.engine.drawHeight - 43,
      name: "codeup.pause_text",
      anchor: new Vector(0, 0),
    });
    a.graphics.use(this.pausedText);

    const a0 = new PDevMenu({
      x: 20,
      y: 43,
      width: 64,
      height: 64,
    });

    Game._instance.currentScene.add(a);
    Game._instance.currentScene.add(a0);
  }

  public static resume() {
    this.paused = false;
    Game._instance.currentScene.actors.map((actor) => {
      if (actor instanceof CActor) {
        actor.closeDevOverlay();
      }
      if (this.remove_after_resume.includes(actor.name)) {
        Game._instance.currentScene.remove(actor);
      }
    });
    UIManager.unmount();
  }
}
