/**
 * apps/web/src/pages/test-vt-desktop.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import VTDesktop from "@codeupspace/vt-desktop/src/VTDesktop";
import { App } from "@codeupspace/vt-desktop/src/types/App";

export default function TestVirtualDesktop() {
  return (
    <>
      <VTDesktop
        backgroundType={"color"}
        backgroundColor={"blue.400"}
        apps={[
          new App("CodeUp", "https://codeup.space/codeup.png", () => {
            return {
              title: "CodeUp",
              content: <div>CodeUp System App</div>,
            };
          }),
        ]}
      />
    </>
  );
}

TestVirtualDesktop.noLayout = true;
