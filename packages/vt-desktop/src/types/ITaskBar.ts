/**
 * packages/vt-desktop/src/types/ITaskBar.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import { IWindow } from "./IWindow";
import { ReactNode } from "react";
import { IApp } from "./IApp";

export interface ITaskBar {
  windows: IWindow[];
  setWindows: (windows: IWindow[]) => void;
  setActiveWindow: (uuid: string | null) => void;
  activeWindow: string | null;
  customItems?: {
    title: string;
    icon: ReactNode;
    onClick: () => void;
  }[];
  applications?: IApp[];
}
