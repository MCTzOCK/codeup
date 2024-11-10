/**
 * packages/vt-desktop/src/windowmanager/WindowManager.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { IWindowManager } from "../types/IWindowManager";
import Window from "./Window";
import { Box, HStack, Image } from "@chakra-ui/react";

export default function WindowManager(props: IWindowManager) {
  return (
    <>
      <Box
        w={"100%"}
        h={"100vh"}
        style={{
          background:
            typeof props.background === "string" ? props.background : undefined,
          ...(typeof props.background === "object" ? props.background : {}),
        }}
      >
        {props.installedApps.map((app) => {
          return (
            <>
              {app.windows.map((window) => (
                <>
                  <Box
                    onMouseDown={() => {
                      props.setActiveWindow(window.uuid);
                    }}
                    onTouchStart={() => {
                      props.setActiveWindow(window.uuid);
                    }}
                  >
                    <Window
                      {...window}
                      zIndex={
                        props.activeWindow === window.uuid ? 999 : window.zIndex
                      }
                      onClose={() => {
                        window.onClose();
                        props.setActiveWindow(null);
                      }}
                      onMove={(x, y) => {
                        props.setWindows(
                          props.windows.map((w) => {
                            if (w.uuid === window.uuid) {
                              w.x = x;
                              w.y = y;
                            }
                            return w;
                          })
                        );
                      }}
                      onMinimize={() => {
                        props.windows.map((w) => {
                          if (w.uuid === window.uuid) {
                            w.onMinimize();
                          }
                        });
                      }}
                    />
                  </Box>
                </>
              ))}
            </>
          );
        })}
        {props.windows.map((window) => (
          <Box
            onMouseDown={() => {
              props.setActiveWindow(window.uuid);
            }}
            onTouchStart={() => {
              props.setActiveWindow(window.uuid);
            }}
          >
            <Window
              {...window}
              zIndex={props.activeWindow === window.uuid ? 999 : window.zIndex}
              onClose={() => {
                window.onClose();
                props.setWindows(
                  props.windows.map((w) => {
                    if (w.uuid === window.uuid) {
                      w.closed = true;
                    }
                    return w;
                  })
                );
                props.setActiveWindow(null);
              }}
              onMove={(x, y) => {
                props.setWindows(
                  props.windows.map((w) => {
                    if (w.uuid === window.uuid) {
                      w.x = x;
                      w.y = y;
                    }
                    return w;
                  })
                );
              }}
              onMinimize={() => {
                props.setWindows(
                  props.windows.map((w) => {
                    if (w.uuid === window.uuid) {
                      w.minimzed = !w.minimzed;
                    }
                    return w;
                  })
                );
              }}
            />
          </Box>
        ))}
        {!props.preventDefaultTaskbar &&
        props.windows.filter((w) => w.minimzed && !w.closed).length > 0 ? (
          <>
            <HStack
              position={"absolute"}
              bottom={0}
              left={0}
              zIndex={1000}
              p={2}
              m={2}
            >
              {props.windows
                .filter((w) => w.minimzed && !w.closed)
                .map((window) => (
                  <Box
                    w={"200px"}
                    h={"50px"}
                    bg={"#000000"}
                    color={"#ffffff"}
                    p={2}
                    m={2}
                    cursor={"pointer"}
                    borderRadius={4}
                    onClick={() => {
                      props.setWindows(
                        props.windows.map((w) => {
                          if (w.uuid === window.uuid) {
                            w.minimzed = false;
                          }
                          return w;
                        })
                      );
                    }}
                  >
                    <HStack spacing={3}>
                      {window.icon && (
                        <Image src={window.icon} width={8} rounded={"md"} />
                      )}
                      <span>{window.title}</span>
                    </HStack>
                  </Box>
                ))}
            </HStack>
          </>
        ) : null}
      </Box>
    </>
  );
}
