/**
 * src/components/course/ModuleCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.07.2022
 *
 */

import * as React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useHover } from "@codeup/hooks";

export default function ModuleCard(props: {
  title: string;
  color: string;
  locked: boolean;
  url: string;
  id: string;
}) {
  const [hoverRef, isHovered] = useHover();

  return (
    <>
      <a
        href={!props.locked ? props.url : undefined}
        style={{ flex: "100%" }}
        target={"_blank"}
      >
        <Box
          backgroundColor={props.locked ? "black" : props.color}
          borderWidth={"4px"}
          padding={"2rem"}
          rounded={"xl"}
          shadow={isHovered && !props.locked ? "2xl" : "none"}
          cursor={!props.locked ? "pointer" : "not-allowed"}
          id={props.id}
          // @ts-ignore
          ref={hoverRef}
          transition={"120ms ease"}
        >
          <Heading textAlign={"center"} size={"md"}>
            {props.locked ? (
              <>
                &#128274;
                <br />
              </>
            ) : null}
            {props.title}
          </Heading>
        </Box>
      </a>
    </>
  );
}
