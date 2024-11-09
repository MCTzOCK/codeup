/**
 * packages/vt-desktop/src/windows/WindowManager.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */
import { IApp } from "../types/IApp";
import { IWindow } from "../types/IWindow";

export default class WindowManager {
  public static windows: IWindow[] = [];
  public static activeWindow: string = "";

  public static addWindow(window: IWindow) {
    window.uuid = Math.random().toString(36).substring(7);
    this.windows.push(window);
  }

  public static removeWindow(uuid: string) {
    this.windows = this.windows.filter((w) => w.uuid !== uuid);
    if (this.activeWindow === uuid) {
      this.activeWindow = "";
    }
  }

  public static getWindow(uuid: string) {
    return this.windows.find((w) => w.uuid === uuid);
  }

  public static getWindows() {
    return this.windows;
  }

  public static getWindowsByAppUUID(appUUID: string) {
    return this.windows.filter((w) => w.appUUID === appUUID);
  }

  public static setActiveWindow(uuid: string) {
    if (this.windows.find((w) => w.uuid === uuid) === undefined) {
      return;
    } else {
      this.activeWindow = uuid;
    }
  }

  public static getActiveWindow() {
    return this.windows.find((w) => w.uuid === this.activeWindow);
  }
}
