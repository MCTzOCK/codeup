/**
 * packages/vt-desktop/src/windows/Window.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import { IWindow } from "../types/IWindow";
import { Box, HStack, Image } from "@chakra-ui/react";
import WindowButton from "./WindowButton";
import { FaMinus, FaPlus, FaX } from "react-icons/fa6";
import WindowManager from "./WindowManager";

export default function Window(props: { window: IWindow }) {
  const [x, setX] = React.useState<number>(0);
  const [y, setY] = React.useState<number>(0);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);

  const [maximized, setMaximized] = React.useState<boolean>(false);
  const [minimized, setMinimized] = React.useState<boolean>(false);

  return (
    <Box
      id={"window-" + props.window.uuid}
      bg={"gray.900"}
      style={{
        zIndex: props.window.active ? 999 : 1,
        width: maximized ? "100%" : width,
        height: maximized ? "100vh" : height,
        top: maximized ? 0 : y,
        left: maximized ? 0 : x,
      }}
      pos={"absolute"}
      minW={"250px"}
      minH={"250px"}
      display={minimized ? "none" : "block"}
      borderRadius={"2xl"}
      resize={
        props.window.resizable && !maximized && !minimized ? "both" : "none"
      }
      overflow={"auto"}
      shadow={"xl"}
      draggable={true}
      onDragEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();

        let xa = e.pageX;
        let ya = e.pageY;

        if (e.pageX < 0) xa = 0;
        if (e.pageX > window.innerWidth - parseInt(width.toString()))
          xa = window.innerWidth - parseInt(width.toString());
        if (e.pageY < 0) ya = 0;
        if (e.pageY > window.innerHeight - parseInt(height.toString()))
          ya = window.innerHeight - parseInt(height.toString());
        setX(xa);
        setY(ya);
      }}
      onResize={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setWidth((e.target as HTMLElement).clientWidth);
        setHeight((e.target as HTMLElement).clientHeight);
      }}
    >
      <Box
        h="fit-content"
        minH={"50px"}
        borderTopRadius={"xl"}
        display={"flex"}
        alignItems={"center"}
        padding={"0 10px"}
        justifyContent={"space-between"}
        bg={"#020202"}
      >
        <HStack spacing={2} userSelect={"none"} pointerEvents={"none"}>
          {props.window.icon && (
            <>
              <Image
                src={props.window.icon}
                alt={props.window.title}
                rounded={"md"}
                width={8}
              />
            </>
          )}
          <span
            style={{
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {props.window.title ? props.window.title : "Window"}
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
            onClick={() => {
              if (props.window.minimizable) {
                setMinimized(!minimized);
              }
            }}
            icon={<FaMinus />}
            color={"#ffff00"}
            hoverColor={"#ffff00"}
          />
          <WindowButton
            onClick={() => {
              if (props.window.maximizable) {
                setMaximized(!maximized);
              }
            }}
            icon={<FaPlus />}
            color={"#00ff00"}
            hoverColor={"#00ff00"}
          />
          <WindowButton
            onClick={() => {
              WindowManager.removeWindow(props.window.uuid);
            }}
            icon={<FaX />}
            color={"#ff0000"}
            hoverColor={"#ff0000"}
          />
        </div>
      </Box>
    </Box>
  );
}
