/**
 * src/videos/html-basics/basics/HTMLUsedFor.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.07.2022
 *
 */

import * as React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { AbsoluteCenter } from "@chakra-ui/react";

export default function HTMLUsedFor() {
  const frame = useCurrentFrame();

  const font =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';

  return (
    <>
      {frame < 30 ? (
        <>
          <AbsoluteFill>
            <AbsoluteCenter>
              <Img
                src={
                  "https://mozilla.design/files/2019/10/Fx-Browser-icon-fullColor-512.png"
                }
              />
            </AbsoluteCenter>
          </AbsoluteFill>
        </>
      ) : null}
      {frame > 30 && frame < 60 ? (
        <>
          <AbsoluteFill>
            <AbsoluteCenter>
              <h1
                style={{
                  fontFamily: font,
                  fontSize: "6rem",
                  color: "#FFF",
                }}
              >
                <span style={{ color: "#808080" }}>&lt;&gt;</span>
                <br />
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: "#808080" }}>&lt;</span>
                <span style={{ color: "#4EC9B0" }}>Element</span>
                <span style={{ color: "#808080" }}>&nbsp;&#47;&gt;</span>
                <br />
                &nbsp;&nbsp;&nbsp;
                <span style={{ color: "#808080" }}>&lt;</span>
                <span style={{ color: "#4EC9B0" }}>Element</span>
                <span style={{ color: "#808080" }}>&nbsp;&#47;&gt;</span>
                <br />
                <span style={{ color: "#808080" }}>&lt;&nbsp;&#47;&gt;</span>
              </h1>
            </AbsoluteCenter>
          </AbsoluteFill>
        </>
      ) : null}
      {frame > 60 && frame < 90 ? (
        <>
          <AbsoluteFill>
            <AbsoluteCenter>
              <h1
                style={{
                  fontSize: "20rem",
                }}
              >
                &#127760;
              </h1>
            </AbsoluteCenter>
          </AbsoluteFill>
        </>
      ) : null}
    </>
  );
}
