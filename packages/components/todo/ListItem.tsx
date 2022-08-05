/**
 * packages/components/todo/ListItem.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.08.2022
 *
 */

import * as React from "react";
import { Box, Checkbox, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export default function ListItem(props: {
  name: string;
  uuid: string;
  finished: boolean;
  listId: string;
  currentList: any;
  setCurrentList: (cf: any) => void;
}) {
  return (
    <>
      <Flex w={"100%"} alignItems={"center"}>
        <Box flex={"10%"}>
          <Checkbox size={"lg"} defaultChecked={props.finished} />
        </Box>
        <Box flex={"80%"}>{props.name}</Box>
        <Box flex={"10%"}>
          <IconButton
            color={"red.300"}
            variant="ghost"
            aria-label={"delete-item"}
            icon={<FaTrash />}
          />
        </Box>
      </Flex>
    </>
  );
}
