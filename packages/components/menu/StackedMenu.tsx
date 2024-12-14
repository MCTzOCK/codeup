/**
 * packages/components/menu/StackedMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2024
 *
 */

import * as React from "react";
import { Menu, MenuButton, MenuList, Stack } from "@chakra-ui/react";

export default function StackedMenu(props: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <>
      <Menu>
        <MenuButton>{props.trigger}</MenuButton>
        <MenuList bg={"#000"} minWidth={"250px"} maxWidth={"90%"} {...props}>
          <Stack gap={4} p={4}>
            {props.children}
          </Stack>
        </MenuList>
      </Menu>
    </>
  );
}
