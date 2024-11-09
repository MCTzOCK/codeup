/**
 * packages/vt-desktop/src/VTDesktop.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import { App } from "./types/App";
import { Box } from "@chakra-ui/react";

export default function VTDesktop(props: {
  backgroundType: "color" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  apps: App[];
}) {
  const [activeWindow, setActiveWindow] = React.useState<string>("");
  return (
    <>
      <Box
        w={"100%"}
        maxW={"100%"}
        h={"100vh"}
        maxH={"100vh"}
        overflow={"hidden"}
        backgroundImage={
          props.backgroundType === "image"
            ? `url(${props.backgroundImage})`
            : "none"
        }
        bgColor={
          props.backgroundType === "color" ? props.backgroundColor : "none"
        }
      ></Box>
    </>
  );
}
