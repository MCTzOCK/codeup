/**
 * src/videos/html-basics/basics/HTMLLongForm.tsx
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

export default function HTMLLongForm() {
  const frame = useCurrentFrame();
  const font =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

  return (
    <>
      <AbsoluteFill style={{ fontFamily: font, fontSize: "6rem" }}>
        <h1
          style={{
            position: "absolute",
            left: "10%",
            top: "10%",
          }}
        >
          <span style={{ color: "red" }}>H</span>
          <span style={{ display: frame > 20 ? "inline" : "none" }}>yper</span>
        </h1>
        <h1
          style={{
            position: "absolute",
            left: "10%",
            top: "30%",
          }}
        >
          <span style={{ color: "red" }}>T</span>
          <span style={{ display: frame > 40 ? "inline" : "none" }}>ext</span>
        </h1>
        <h1
          style={{
            position: "absolute",
            left: "10%",
            top: "50%",
          }}
        >
          <span style={{ color: "red" }}>M</span>
          <span style={{ display: frame > 60 ? "inline" : "none" }}>arkup</span>
        </h1>
        <h1
          style={{
            position: "absolute",
            left: "10%",
            top: "70%",
          }}
        >
          <span style={{ color: "red" }}>L</span>
          <span style={{ display: frame > 80 ? "inline" : "none" }}>
            anguage
          </span>
        </h1>
      </AbsoluteFill>
    </>
  );
}
