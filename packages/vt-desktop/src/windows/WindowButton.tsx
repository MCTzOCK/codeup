/**
 * packages/vt-desktop/src/windows/WindowButton.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.11.2024
 *
 */

import * as React from "react";
import { IconButton } from "@chakra-ui/react";

export default function WindowButton(props: {
  onClick: () => void;
  icon: any;
  color: string;
  hoverColor: string;
}) {
  return (
    <>
      <IconButton
        aria-label={""}
        icon={props.icon}
        color={props.color}
        backgroundColor={"gray.900"}
        onClick={() => {
          props.onClick();
        }}
        size={"sm"}
        borderRadius={"full"}
      />
    </>
  );
}
