/**
 * src/videos/html-basics/basics/WhatIsHTML.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.07.2022
 *
 */

import * as React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AbsoluteCenter } from "@chakra-ui/react";

export default function WhatIsHTMLTitle() {
  const frame = useCurrentFrame();

  const font =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

  return (
    <>
      <AbsoluteFill>
        <AbsoluteCenter>
          <h1
            style={{
              fontFamily: font,
              fontSize: "6rem",
              textAlign: "center",
              transform:
                frame < 55
                  ? `translateY(${interpolate(frame, [0, 5], [-300, 0], {
                      extrapolateRight: "clamp",
                    })}px)`
                  : `translateY(${interpolate(frame, [55, 60], [0, -300], {
                      extrapolateRight: "clamp",
                    })}px)`,
              color: "#FFF",
            }}
          >
            What is HTML?
          </h1>
        </AbsoluteCenter>
      </AbsoluteFill>
    </>
  );
}
