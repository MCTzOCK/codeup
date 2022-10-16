/**
 * apps/web/src/pages/test-player.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.10.2022
 *
 */

import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import VideoPlayer from "@codeup/components/global/VideoPlayer";

export default function TestPlayer() {

  return (
    <>
      <Flex w={"100%"} h={"25%"} alignItems={"center"} justifyContent={"center"}>
        <Box w={"25%"} h={"100%"}>
          <VideoPlayer url={"https://www.youtube.com/watch?v=tKlkDMoHmM8"} />
        </Box>
      </Flex>
    </>
  );
}