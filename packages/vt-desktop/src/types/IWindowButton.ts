/**
 * packages/vt-desktop/src/types/IWindowButton.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import React from "react";

export interface IWindowButton {
  onClick: () => void;
  icon: any;
  color: string;
  hoverColor: string;
  disabled?: boolean;
  cl?: string;
}
