/**
 * packages/vt-desktop/src/types/IApp.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import { IWindow } from "./IWindow";

export interface IApp {
  name: string;
  icon: string;
  component: React.ReactNode;
  uuid: string;
  windows: IWindow[];
  flags?: {
    [key: string]: any;
  };
  onAppOpen?: () => void;
}
