/**
 * packages/vt-desktop/src/windowmanager/WindowButton.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2024
 *
 */

import * as React from "react";
import { IWindowButton } from "../types/IWindowButton";
import { IconButton } from "@chakra-ui/react";

export default function WindowButton(props: IWindowButton) {
  return (
    <>
      <IconButton
        className={props.cl}
        aria-label={""}
        icon={props.icon}
        isDisabled={props.disabled}
        color={props.color}
        onClick={() => {
          if (!props.disabled) {
            props.onClick();
          }
        }}
        bgColor={"gray.700"}
        _hover={{
          bgColor: "gray.600",
        }}
        size={"sm"}
        borderRadius={"full"}
      />
    </>
  );
}
