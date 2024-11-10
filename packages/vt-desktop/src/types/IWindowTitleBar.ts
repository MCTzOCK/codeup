/**
 * packages/vt-desktop/src/types/IWindowTitleBar.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

export interface IWindowTitleBar {
  uuid: string;
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  maximized: boolean;
  minimized: boolean;
  icon?: string;
}
