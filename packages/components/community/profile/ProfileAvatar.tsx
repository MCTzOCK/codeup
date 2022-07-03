/**
 * src/components/community/profile/ProfileAvatar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import * as React from "react";
import { Avatar, Flex } from "@chakra-ui/react";

export default function ProfileAvatar(props: { url: string }) {
  return (
    <>
      <Flex justifyContent={["center", "flex-start"]}>
        <Avatar
          src={props.url}
          w={128}
          h={128}
          mt={"-3rem"}
          marginInlineStart={["0", "1rem"]}
          borderColor={"#FFF"}
          borderWidth={"4px"}
        />
      </Flex>
    </>
  );
}
