/**
 * packages/vt-desktop/src/types/App.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */
import * as React from "react";
import { Window } from "./Window";

export class App {
  public name: string;
  public icon: string;
  public uuid: string;
  public createWindow: () => void;
  public windows: any[] = [];

  constructor(
    name: string,
    icon: string,
    createWindow: () => {
      title: string;
      content: React.ReactNode;
    }
  ) {
    this.name = name;
    this.icon = icon;
    this.uuid = Math.random().toString(36);
    this.createWindow = () => {
      const cw = createWindow();
      const window = new Window(cw.title, cw.content, this);
      window.uuid = Math.random().toString(36).substring(7);
      this.windows.push(window);
    };
  }
}
