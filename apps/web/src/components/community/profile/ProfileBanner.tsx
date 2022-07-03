/**
 * src/components/community/profile/ProfileBanner.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.06.2022
 *
 */

import * as React from "react";
import { Image } from "@chakra-ui/react";

export default function ProfileBanner(props: { url: string }) {
  return (
    <>
      <Image
        src={props.url}
        w={"100%"}
        h={[312, 624]}
        maxHeight={[250, 450]}
        maxW={"100vw"}
        style={{ objectFit: "none" }}
        borderRadius={"12px"}
        borderTopRadius={0}
        alt={"Banner"}
        shadow={"lg"}
      />
    </>
  );
}
