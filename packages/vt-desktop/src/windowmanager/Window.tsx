/**
 * packages/vt-desktop/src/windowmanager/Window.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { IWindow } from "../types/IWindow";
import { WINDOW_MANAGER } from "../Constants";
import { Box, HStack, Image as CImage } from "@chakra-ui/react";
import { FaMinus, FaPlus, FaX } from "react-icons/fa6";
import WindowButton from "./WindowButton";

export default function Window(props: IWindow) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  const [width, setWidth] = React.useState(props.width);
  const [height, setHeight] = React.useState(props.height);

  const [maximized, setMaximized] = React.useState(props.maximized);
  const [minimized, setMinimized] = React.useState(props.minimzed);

  const [closed, setClosed] = React.useState(props.closed);

  const onMove = (x: number, y: number) => {
    const maxX = window.innerWidth - parseInt(width.toString());
    const maxY = window.innerHeight - parseInt(height.toString());
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;
    setX(x);
    setY(y);
    props.onMove(x, y);
  };

  const [isDragging, setIsDragging] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);
  const [isResizing, setIsResizing] = React.useState(false);

  useEffect(() => {
    props.onMove(x, y);
    props.onResize(width as any, height as any);
  }, [x, y, width, height]);

  if (props.closed) return <></>;

  return (
    <>
      <Box
        id={"window-" + props.uuid}
        bg={WINDOW_MANAGER.DEFAULT_WINDOW_BACKGROUND}
        pos={"absolute"}
        minW={"200px"}
        minH={"200px"}
        display={minimized ? "none" : "block"}
        style={{
          zIndex: props.zIndex,
          width: maximized ? "100%" : width,
          height: maximized ? "100vh" : height,
          top: maximized ? 0 : y,
          left: maximized ? 0 : x,
        }}
        borderRadius={"2xl"}
        shadow={"xl"}
        fontFamily={"sans-serif"}
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
        // window resizing
        resize={
          props.resizable && !maximized && !minimized
            ? isResizing
              ? "both"
              : "both"
            : "none"
        }
        overflow="auto"
        onResize={(e) => {
          setIsResizing(true);
        }}
      >
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
                <CImage src={props.icon} rounded={"md"} width={8} />
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
              onClick={() => {
                if (props.minimizable) {
                  setMinimized(!minimized);
                }
              }}
              icon={<FaMinus />}
              color={"#ffff00"}
              hoverColor={"#ffff00"}
            />
            <WindowButton
              onClick={() => {
                if (props.maximizable) {
                  setMaximized(!maximized);
                }
              }}
              icon={<FaPlus />}
              color={"#00ff00"}
              hoverColor={"#00ff00"}
            />
            <WindowButton
              onClick={props.onClose}
              icon={<FaX />}
              color={"#ff0000"}
              hoverColor={"#ff0000"}
            />
          </div>
        </Box>
        <Box
          w={"100%"}
          h={"calc(100% - 50px)"}
          overflow={"hidden"}
          display={"flex"}
          flexDirection={"column"}
          id={"window-content-" + props.uuid}
        >
          {props.type === "component" && !closed && (
            <Box
              w={"100%"}
              h={"100%"}
              overflow={"auto"}
              style={{
                padding: "10px",
              }}
            >
              {props.component}
            </Box>
          )}
          {props.type === "iframe" && !closed && (
            <iframe
              src={props.url}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
