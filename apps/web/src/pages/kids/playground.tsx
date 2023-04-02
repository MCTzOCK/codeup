/**
 * apps/web/src/pages/kids/playground.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.04.2023
 *
 */

import * as React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import BlocklyEditor from "@codeup/util/src/blockly/BlocklyEditor";
import { BlocklyCompiler } from "@codeup/util/src/blockly/blockly/BlocklyCompiler";
import Networking from "@codeup/util/dist/Networking";
import Blockly from "blockly";
import { FaPlay } from "react-icons/fa";

export default function Playground() {
  return (
    <>
      <Flex
        w={"100%"}
        minH={"100vh"}
        h={"fit-content"}
        direction={["column", "row"]}
        gap={"2rem"}
      >
        <Box w={"100%"} h={"100vh"} flex={"100%"}>
          <BlocklyEditor
            initialXml={
              '<xml><block type="html" id="|(^9%DCME)E4UEoWv~G]" x="134" y="70"></block></xml>'
            }
          />
        </Box>
        <Box flex={"5%"}>
          <Button
            onClick={() => {
              const iframe = document.getElementById(
                "codeup-kids_playground_preview"
              ) as HTMLIFrameElement;

              const html = new BlocklyCompiler().compile();

              iframe.srcdoc = html;
            }}
            leftIcon={<FaPlay />}
            mt={[0, 8]}
            ml={[8, 0]}
            colorScheme={"green"}
          >
            Run
          </Button>
        </Box>
        <Box flex={"100%"}>
          <iframe
            id={"codeup-kids_playground_preview"}
            width={"100%"}
            height={"100vh"}
            style={{
              border: "none",
              height: "100vh",
            }}
          ></iframe>
        </Box>
      </Flex>
    </>
  );
}
