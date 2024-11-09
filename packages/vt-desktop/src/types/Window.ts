/**
 * packages/vt-desktop/src/types/Window.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */
import { App } from "./App";

export class Window {
  public app: App;
  public title: string;
  public content: React.ReactNode;
  public uuid: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 800;
  public height: number = 600;
  public minimized: boolean = false;
  public maximized: boolean = false;

  constructor(title: string, content: React.ReactNode, app: App) {
    this.title = title;
    this.content = content;
    this.uuid = Math.random().toString(36);
    this.app = app;
  }
}
