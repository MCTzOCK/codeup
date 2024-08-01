/**
 * apps/game/src/ui/Popup.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.08.2024
 *
 */

import * as React from "react";
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { PauseManager } from "../managers/PauseManager";
import { UIManager } from "./UIManager";

export default function Popup(props: {
  children: React.ReactElement | React.ReactNode;
  title: string;
}) {
  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: "50%",
          overflow: "auto",
        }}
        background={"gray.800"}
        rounded={"xl"}
        p={6}
      >
        <HStack justifyContent={"space-between"}>
          <Heading color={"brand.500"}>{props.title}</Heading>
          <IconButton
            aria-label={"Close"}
            icon={<FaTimes />}
            variant={"brand"}
            onClick={() => {
              UIManager.unmount();
            }}
          />
        </HStack>
        {props.children}
      </Box>
    </>
  );
}
