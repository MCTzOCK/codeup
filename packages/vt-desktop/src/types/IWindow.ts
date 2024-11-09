/**
 * packages/vt-desktop/src/types/IWindow.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

export interface IWindow {
  uuid: string;
  type: "iframe" | "component";
  title: string;
  url?: string;
  component?: any;
  width: number | string;
  height: number | string;
  zIndex: number;
  resizable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  minimzed: boolean;
  maximized: boolean;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  x?: number;
  y?: number;
  icon?: string;
  backgroundColor?: string;
  appUUID: string;
  active: boolean;
}
