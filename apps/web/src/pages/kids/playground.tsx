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
import BlocklyEditor from "@codeup/incode-blockly/dist/BlocklyEditor";
//import { BlocklyCompiler } from "@codeup/incode-blockly/dist/blockly/BlocklyCompiler";
import { FaPlay } from "react-icons/fa";
import * as InCode from "@codeup/incode-compiler/dist";

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
              '<xml><block type="start" id="|(^9%DCME)E4UEoWv~G]" x="134" y="70"></block></xml>'
            }
          />
        </Box>
        <Box flex={"5%"}>
          <Button
            onClick={() => {
              const iframe = document.getElementById(
                "codeup-kids_playground_preview"
              ) as HTMLIFrameElement;

              const incode = new InCode.BlocklyCompiler().compile();
              const html = InCode.Compiler.compile(incode);

              iframe.srcdoc =
                "<html><body><script defer async>" +
                html +
                "</script></body></html>";
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
