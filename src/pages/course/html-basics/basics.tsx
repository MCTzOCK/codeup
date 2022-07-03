/**
 * src/pages/course/html-basics/basics.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.07.2022
 *
 */

import { Player } from "@remotion/player";
import * as React from "react";
import { HTMLCourseBasics } from "../../../videos/html-basics/basics";

export default function basics() {
  return (
    <>
      <Player
        component={HTMLCourseBasics}
        compositionWidth={1280}
        compositionHeight={720}
        controls
        autoPlay
        loop
        fps={30}
        durationInFrames={1024}
      />
    </>
  );
}
