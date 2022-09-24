/**
 * apps/web/src/pages/forum/messages/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import {
  Avatar,
  Badge,
  Box,
  chakra,
  Divider,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import ChatCardV2 from "@codeup/components/forum/ChatCardV2";

export default function MessageView() {
  const [chats, setChats] = useState([
    {
      id: 1,
      username: "ben.sbrt",
      displayName: "Ben Siebert",
      verified: true,
      profilePicture: "/api/account/ben.sbrt/picture",
    },
  ]);

  const [activeChat, setActiveChat] = useState<number>(0);

  const router = useRouter();

  return (
    <>
      <Flex direction={"row"} w={"100%"} h={"100vh"}>
        <Box flex={"20%"} borderRight={"solid 1px white"}>
          <Flex
            direction={"column"}
            w={"100%"}
            minH={"100%"}
            maxH={"100%"}
            overflow={"auto"}
          >
            <Heading size={"lg"} textAlign={"center"} mt={4}>
              Benutzer
            </Heading>
            <Divider mt={4} />
            {chats.map((chat) => (
              <>
                <ChatCardV2 chat={chat} setActiveChat={setActiveChat} />
                <Divider />
              </>
            ))}
          </Flex>
        </Box>
        <Box flex={"80%"}></Box>
      </Flex>
    </>
  );
}
