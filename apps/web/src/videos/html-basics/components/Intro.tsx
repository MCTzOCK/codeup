/**
 * src/videos/html-basics/components/Intro.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */

import * as React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AbsoluteCenter, Heading } from "@chakra-ui/react";

export default function Intro(props: { sectionName: string }) {
  const frame = useCurrentFrame();

  const font =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

  const opacity0 = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity1 = interpolate(frame, [60, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill>
        <AbsoluteCenter>
          <h1
            style={{
              fontFamily: font,
              fontSize: "6rem",
              fontWeight: "800",
              letterSpacing: "-0.06em",
              color: "#FFF",
              textAlign: "center",
              opacity: opacity0,
            }}
          >
            HTML Course
            <br />
            <span style={{ opacity: opacity1 }}>{props.sectionName}</span>
          </h1>
        </AbsoluteCenter>
      </AbsoluteFill>
    </>
  );
}
