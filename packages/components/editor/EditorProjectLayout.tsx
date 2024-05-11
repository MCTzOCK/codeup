/**
 * packages/components/editor/EditorProjectLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2023
 *
 */

import * as React from "react";
import { useLoggedIn } from "@codeup/hooks";
import { Box, CircularProgress, Flex, Heading } from "@chakra-ui/react";
import EditorPagesSidebar from "./EditorPagesSidebar";

export default function EditorProjectLayout(props: {
  children: React.ReactNode;
}) {
  const { loggedIn, loaded, userInfo } = useLoggedIn();

  return (
    <>
      {loggedIn ? (
        <>
          <Flex w={"100%"} minH={"100vh"} direction={"row"} bg={"#000"}>
            <Box flex={"10%"}>
              <EditorPagesSidebar />
            </Box>
            <Box flex={"80%"} bgColor={"#000"}>
              {props.children}
            </Box>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            w={"100%"}
            h={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"column"}
          >
            <CircularProgress size={"80px"} isIndeterminate color="green.300" />
            <Heading size={"lg"} mt={4}>
              Anmelden ...
            </Heading>
          </Flex>
        </>
      )}
    </>
  );
}
