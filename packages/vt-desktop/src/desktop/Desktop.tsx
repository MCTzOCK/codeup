/**
 * packages/vt-desktop/src/desktop/Desktop.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { IDesktop } from "../types/IDesktop";
import { Box, Image, VStack } from "@chakra-ui/react";

export default function Desktop(props: IDesktop) {
  return (
    <>
      <Box
        zIndex={"2"}
        position={"absolute"}
        top={"0"}
        left={"0"}
        width={"100%"}
        height={"100vh"}
        backgroundColor={props.backgroundColor}
        backgroundImage={props.backgroundImage}
        backgroundSize={"cover"}
        backgroundPosition={"center"}
        backgroundRepeat={"no-repeat"}
        backgroundAttachment={"fixed"}
        display={"grid"}
        gridTemplateColumns={"repeat(auto-fill, minmax(100px, 1fr))"}
        p={4}
        gap={4}
      >
        {props.items.map((item, index) => {
          return (
            <>
              <VStack>
                <Box
                  key={index}
                  bg={"gray.800"}
                  display={"flex"}
                  rounded={"xl"}
                  shadow={"xl"}
                  w={"100%"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={item.onClick}
                  cursor={"pointer"}
                  style={{
                    aspectRatio: 1,
                  }}
                  padding={3}
                >
                  {item.icon}
                </Box>
                <span>{item.label}</span>
              </VStack>
            </>
          );
        })}
        {props.installedApps
          .filter((app) => app.flags && app.flags["modos.desktop"])
          .map((app) => {
            return (
              <>
                <VStack>
                  <Box
                    bg={"gray.800"}
                    display={"flex"}
                    rounded={"xl"}
                    shadow={"xl"}
                    w={"100%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() => {
                      app.onAppOpen && app.onAppOpen();
                    }}
                    cursor={"pointer"}
                    style={{
                      aspectRatio: 1,
                    }}
                    padding={3}
                  >
                    <Image src={app.icon} rounded={"md"} width={"100%"} />
                  </Box>
                  <span>{app.name}</span>
                </VStack>
              </>
            );
          })}
      </Box>
    </>
  );
}
