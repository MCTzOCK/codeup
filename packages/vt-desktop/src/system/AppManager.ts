/**
 * packages/vt-desktop/src/system/AppManager.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */
import { IApp } from "../types/IApp";

export default class AppManager {
  private static apps: IApp[] = [];

  public static addApp(app: IApp) {
    this.apps.push(app);
  }

  public static removeApp(uuid: string) {
    this.apps = this.apps.filter((a) => a.uuid !== uuid);
  }

  public static getApp(uuid: string) {
    return this.apps.find((a) => a.uuid === uuid);
  }

  public static getApps() {
    return this.apps;
  }
}
