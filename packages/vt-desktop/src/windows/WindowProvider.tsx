/**
 * packages/vt-desktop/src/windows/WindowProvider.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import Window from "./Window";
import { IWindow } from "../types/IWindow";

export default function WindowProvider(props: {
  windows: IWindow[];
  setWindows: React.Dispatch<React.SetStateAction<IWindow[]>>;
}) {
  return (
    <>
      {props.windows.map((w) => (
        <>
          <div
            onMouseDown={() => {
              props.setWindows((prev: any) => {
                let newWindows = prev;
                for (const w of prev) {
                  w.active = w.uuid === w.uuid;
                  newWindows.push(w);
                }
                console.log(newWindows);
                return newWindows as any;
              });
            }}
            onTouchStart={() => {
              props.setWindows((prev: any) => {
                let newWindows = prev;
                for (const w of prev) {
                  w.active = w.uuid === w.uuid;
                  newWindows.push(w);
                }
                return newWindows as any;
              });
            }}
          >
            <Window window={w} />
          </div>
        </>
      ))}
    </>
  );
}
