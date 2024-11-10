/**
 * packages/vt-desktop/src/taskbar/TaskBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { ITaskBar } from "../types/ITaskBar";
import { Box, Flex, HStack, Image, Tooltip } from "@chakra-ui/react";
import { FaFile } from "react-icons/fa6";

export default function TaskBar(props: ITaskBar) {
  return (
    <>
      <Flex
        w={"100%"}
        position={"absolute"}
        bottom={0}
        left={0}
        alignItems={"center"}
        justifyContent={"center"}
        p={4}
        zIndex={1001}
      >
        <Box
          rounded={"md"}
          bg={"gray.900"}
          w={"fit-content"}
          maxW={"fit-content"}
          flex={"100%"}
          p={4}
        >
          <HStack spacing={4} w={"fit-content"}>
            {props.customItems &&
              props.customItems.map((item) => (
                <>
                  <Tooltip label={item.title}>
                    <Flex
                      key={"custom-" + item.title}
                      bg={"gray.800"}
                      p={2}
                      rounded={"md"}
                      _hover={{
                        bg: "gray.700",
                      }}
                      cursor={"pointer"}
                      h={"60px"}
                      w={"fit-content"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </Flex>
                  </Tooltip>
                </>
              ))}
            {props.applications &&
              props.applications.map((app) => (
                <>
                  <Tooltip label={app.name}>
                    <Flex
                      key={app.uuid}
                      bg={"gray.800"}
                      p={2}
                      rounded={"md"}
                      _hover={{
                        bg: "gray.700",
                      }}
                      cursor={"pointer"}
                      h={"60px"}
                      w={"fit-content"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      onClick={() => {
                        app.onAppOpen && app.onAppOpen();
                      }}
                    >
                      {app.icon ? (
                        <>
                          <Image src={app.icon} width={12} rounded={"md"} />
                        </>
                      ) : (
                        <FaFile size={42} />
                      )}
                    </Flex>
                  </Tooltip>
                </>
              ))}
          </HStack>
        </Box>
      </Flex>
    </>
  );
}
