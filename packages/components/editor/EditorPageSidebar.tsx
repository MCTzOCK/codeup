/**
 * packages/components/editor/EditorPageSidebar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.01.23
 *
 */
import * as React from "react";
import { Box, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { FaCode, FaFile, FaHome } from "react-icons/fa";
import { useRouter } from "next/router";

export default function EditorPageSidebar(props: {
  page: {
    url: string;
    mainContent: string;
    type: string;
    resources: any[];
  };
  projectId: string;
}) {
  const router = useRouter();

  return (
    <>
      <Box p={"2rem"} w={"100%"} h={"100%"}>
        <Box backgroundColor={"black"} h={"100%"} boxShadow={"2xl"}>
          <Flex direction={"column"} h={"100%"}>
            <Tooltip label={"Code"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaCode />}
                rounded={"none"}
                onClick={() => {}}
              />
            </Tooltip>
            <Tooltip label={"Übersicht"} placement={"right"} hasArrow>
              <IconButton
                aria-label={""}
                variant="ghost"
                size={"lg"}
                fontSize={"2xl"}
                p={"2rem"}
                icon={<FaHome />}
                rounded={"none"}
                onClick={() => {
                  router.push("/editor/" + props.projectId);
                }}
              />
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
