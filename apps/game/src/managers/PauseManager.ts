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

export class PauseManager {
  public static paused = false;

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
  }

  public static resume() {
    this.paused = false;
    Game._instance.currentScene.actors.map((actor) => {
      if (actor instanceof CActor) {
        actor.closeDevOverlay();
      }
    });
    UIManager.unmount();
  }
}
