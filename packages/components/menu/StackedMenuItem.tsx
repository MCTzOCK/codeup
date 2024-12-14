/**
 * packages/components/menu/StackedMenuItem.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2024
 *
 */

import * as React from "react";
import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";

export default function StackedMenuItem(props: {
  title: string;
  description: string;
  icon: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <>
      <HStack w={"100%"} gap={4} {...props} cursor={"default"}>
        <Box
          bg={"#121212"}
          cursor={"default"}
          _hover={{
            bg: "#212121",
          }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          p={4}
          borderRadius={"lg"}
          aspectRatio={"1/1"}
        >
          {props.icon}
        </Box>
        <Stack>
          <Heading size={"md"}>{props.title}</Heading>
          <Text color={"gray"} fontSize={"sm"}>
            {props.description}
          </Text>
        </Stack>
      </HStack>
    </>
  );
}
