/**
 * src/videos/html-basics/basics.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.07.2022
 *
 */

import * as React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import Intro from "./components/Intro";
import WhatIsHTMLTitle from "./basics/WhatIsHTMLTitle";
import HTMLLongForm from "./basics/HTMLLongForm";
import HTMLUsedFor from "./basics/HTMLUsedFor";
import audio from "./basics/0.mp3";

export function HTMLCourseBasics() {
  const frame = useCurrentFrame();

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "black", color: "white" }}>
        <Audio src={audio} />
        <Sequence from={0} durationInFrames={120}>
          <Img
            src={staticFile("_static/images/courses/splashes/html-basics.svg")}
            style={{
              opacity: interpolate(frame, [80, 120], [1, 0], {
                extrapolateRight: "clamp",
              }),
            }}
          />
        </Sequence>
        <Sequence from={150} durationInFrames={60}>
          <WhatIsHTMLTitle />
        </Sequence>
        <Sequence from={220} durationInFrames={120}>
          <HTMLLongForm />
        </Sequence>
        <Sequence from={350} durationInFrames={120}>
          <HTMLUsedFor />
        </Sequence>
      </AbsoluteFill>
    </>
  );
}
