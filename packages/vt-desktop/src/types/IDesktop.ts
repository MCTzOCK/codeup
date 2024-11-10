/**
 * packages/vt-desktop/src/desktop/IDesktop.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */
import React from "react";
import { IApp } from "./IApp";

export interface IDesktop {
  backgroundType: "color" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  items: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
  installedApps: IApp[];
}
