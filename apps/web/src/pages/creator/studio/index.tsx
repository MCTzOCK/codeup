/**
 * apps/web/src/pages/creator/studio/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.11.2022
 *
 */

import * as React from "react";
import CreatorStudioLayout from "@codeup/components/creator/studio/CreatorStudioLayout";
import {
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export default function Index() {
  const [query, setQuery] = React.useState("");

  return (
    <>
      <CreatorStudioLayout>
        <Flex
          w={"100%"}
          minH={"100vh"}
          h={"fit-content"}
          direction={"column"}
          alignItems={"center"}
          mt={"4rem"}
        >
          <Heading
            fontSize={["3xl", "6xl"]}
            color={"white"}
            textAlign={"center"}
            fontWeight={"bold"}
            fontFamily={"Seymour One"}
            maxW={["75%", "50%"]}
            textShadow={"0px 10px 100px #000000"}
          >
            Willkommen im Creator Studio
          </Heading>
          <InputGroup w={["75%", "50%"]} mt={"2rem"} maxW={["75%", "50%"]}>
            <InputLeftElement pointerEvents="none">
              <FaSearch />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Meine Kurse durchsuchen"
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
        {query}
      </CreatorStudioLayout>
    </>
  );
}
