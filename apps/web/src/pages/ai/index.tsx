/**
 * apps/web/src/pages/ai/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.07.2024
 *
 */

import * as React from "react";
import { useUserLoggedInRedirect } from "@codeup/hooks";
import AppShell from "@codeup/components/global/AppShell";
import { FaLightbulb, FaPlus } from "react-icons/fa";
import {
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CHeading } from "@codeup/components/global/CHeading";
import { FaPaperPlane } from "react-icons/fa6";

export default function Index() {
  useUserLoggedInRedirect({
    allowAnonymous: false,
  });
  return (
    <>
      <AppShell
        title={"Chats"}
        sub_pages={[
          {
            onClick: () => {},
            text: "Neuer Chat",
            icon: <FaPlus />,
          },
        ]}
      >
        <Flex justifyContent={"center"} h={"100vh"} w={"100%"} p={2}>
          <Flex
            w={["100%", "100%", "40%"]}
            outline={"1px solid lime"}
            h={"fit-content"}
            minH={"90vh"}
            p={2}
            direction={"column"}
          >
            <CHeading size={"xl"} textAlign={"center"} flex={0.05}>
              KI-Assistent
            </CHeading>
            <Box w={"100%"} outline={"1px solid red"} flex={1}>
              123
            </Box>
            <Box flex={0.05}>
              <VStack gap={2} pt={4}>
                <Grid
                  templateColumns={"repeat(2, 1fr)"}
                  gap={4}
                  maxW={["100%", "100%", "35%"]}
                >
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                  >
                    <Text>Gib mir eine Projektidee!</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                  >
                    <Text>Was ist React?</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                  >
                    <Text>Gib mir die Definition einer REST-API.</Text>
                  </Box>
                  <Box
                    rounded={"md"}
                    borderWidth={2}
                    borderColor={"brand.500"}
                    p={2}
                    cursor={"pointer"}
                  >
                    <Text>Welche Eigenschaften hat ein Algorithmus?</Text>
                  </Box>
                </Grid>
                <HStack w={["100%", "75%"]} gap={2}>
                  <Input
                    placeholder={"Nachricht"}
                    flex={1}
                    variant={"filled"}
                  />
                  <IconButton
                    icon={<FaPaperPlane />}
                    variant={"brand"}
                    aria-label={"123"}
                  />
                </HStack>
              </VStack>
            </Box>
          </Flex>
        </Flex>
      </AppShell>
    </>
  );
}
