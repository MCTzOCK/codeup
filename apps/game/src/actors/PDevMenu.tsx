/**
 * apps/game/src/actors/PDevMenu.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import { Actor, ActorArgs, Color, Font, Text, Vector } from "excalibur";
import { Resources } from "../resources";
import { UIManager } from "../ui/UIManager";
import Console from "../ui/Console";

export class PDevMenu extends Actor {
  constructor(props: ActorArgs) {
    super(props);
    this.anchor.setTo(0, 0);
    this.name = "PDevMenu";
    this.on("pointerenter", () => {
      document.body.style.cursor = "pointer";
    });
    this.on("pointerleave", () => {
      document.body.style.cursor = "default";
    });
    this.on("pointerdown", () => {
      UIManager.render(
        <>
          <Console />
        </>
      );
    });

    const text = new Text({
      text: "Konsole",
      color: Color.Azure,
      font: new Font({
        size: 23,
        family: "Tahoma",
      }),
    });

    this.graphics.use(text);
  }
}
