/**
 * packages/vt-desktop/src/types/IWindowManager.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import { IWindow } from "./IWindow";
import { IApp } from "./IApp";

export interface IWindowManager {
  background:
    | string
    | {
        [key: string]: string;
      };
  windows: IWindow[];
  setWindows: (windows: IWindow[]) => void;
  preventDefaultTaskbar?: boolean;
  setActiveWindow: (uuid: string | null) => void;
  activeWindow: string | null;
  installedApps: IApp[];
}
