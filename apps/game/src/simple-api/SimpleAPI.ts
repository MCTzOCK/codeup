/**
 * apps/game/src/simple-api/SimpleAPI.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */
import { Game } from "../Game";
import { CActor } from "../extends/CActor";
import { Enemy } from "../actors/Enemy";

const removeByName = (name: string) => {
  const scene = Game._instance.currentScene;
  const a = scene.actors.find((a) => a.name === name);

  if (a instanceof CActor && name !== "PLAYER") {
    Game._instance.currentScene.remove(a);
  } else {
    console.warn("Actor not found.");
  }
};

const getByName = (name: string): CActor | undefined => {
  const scene = Game._instance.currentScene;
  const a = scene.actors.find((a) => a.name === name);
  if (a instanceof CActor) {
    return a;
  }
  return undefined;
};

window.removeByName = removeByName;
window.getByName = getByName;
