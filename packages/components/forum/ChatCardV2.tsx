/**
 * packages/components/forum/ChatCardV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2022
 *
 */

import * as React from "react";
import { Avatar, chakra, Flex, Heading, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

export default function ChatCardV2(props: {
  chat: {
    id: number;
    username: string;
    displayName: string;
    verified: boolean;
  };
  setActiveChat: (i: number) => void;
}) {
  return (
    <>
      <Flex
        direction={"row"}
        alignItems={"center"}
        gap={"1rem"}
        p={8}
        key={props.chat.id}
        cursor={"pointer"}
        onClick={() => {
          props.setActiveChat(props.chat.id);
        }}
      >
        <Avatar
          size={"md"}
          src={"/api/account/" + props.chat.username + "/picture"}
        />
        <Flex direction={"column"}>
          <Heading size={"md"}>{props.chat.displayName}</Heading>
          <Text color={"gray"}>@{props.chat.username}</Text>
        </Flex>

        {props.chat.verified ? (
          <chakra.span color={"green.500"} fontSize={"2xl"}>
            <FaCheckCircle />
          </chakra.span>
        ) : null}
      </Flex>
    </>
  );
}
