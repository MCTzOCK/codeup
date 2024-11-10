/**
 * packages/vt-desktop/src/windowmanager/WindowTitleBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { IWindowTitleBar } from "../types/IWindowTitleBar";
import { WINDOW_MANAGER } from "../Constants";
import WindowButton from "./WindowButton";
import { FaMinus, FaPlus, FaX } from "react-icons/fa6";
import { Box, HStack, Image } from "@chakra-ui/react";

export default function WindowTitleBar(props: IWindowTitleBar) {
  return (
    <>
      <Box
        bgColor={WINDOW_MANAGER.WINDOW_TITLE_BAR_BACKGROUND_COLOR}
        h="fit-content"
        minH={"50px"}
        borderTopRadius={"xl"}
        display={"flex"}
        alignItems={"center"}
        padding={"0 10px"}
        justifyContent={"space-between"}
      >
        <HStack spacing={2} userSelect={"none"} pointerEvents={"none"}>
          {props.icon && (
            <>
              <Image src={props.icon} rounded={"md"} width={8} />
            </>
          )}
          <span
            style={{
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {props.title}
          </span>
        </HStack>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <WindowButton
            onClick={props.onMinimize}
            icon={<FaMinus />}
            color={"#ffff00"}
            hoverColor={"#ffff00"}
            disabled={props.minimized}
          />
          <WindowButton
            onClick={props.onMaximize}
            icon={<FaPlus />}
            color={"#00ff00"}
            hoverColor={"#00ff00"}
            disabled={props.maximized}
          />
          <WindowButton
            onClick={props.onClose}
            icon={<FaX />}
            color={"#ff0000"}
            hoverColor={"#ff0000"}
          />
        </div>
      </Box>
    </>
  );
}
