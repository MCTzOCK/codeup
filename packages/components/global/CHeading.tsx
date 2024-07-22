/**
 * packages/components/global/CHeading.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.05.2024
 *
 */

import * as React from "react";

import { Heading as ChakraHeading } from "@chakra-ui/react";

// ...rest
export function CHeading(props: {
  children: React.ReactNode | string;
  size?: string;
  [key: string]: any;
}) {
  const { ...rest } = props;
  return (
    <ChakraHeading
      as={"h1"}
      size={(props.size as any) || "2xl"}
      fontWeight={900}
      //letterSpacing={-2}
      fontFamily={"Geist Black"}
      color={"brand.500"}
      {...rest}
    >
      {props.children}
    </ChakraHeading>
  );
}
