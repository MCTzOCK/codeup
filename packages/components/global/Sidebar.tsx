/**
 * packages/components/global/Sidebar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.04.2023
 *
 */

import * as React from "react";
import { ReactNode } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

export default function Sidebar(props: {
  entries: {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[];
  title: string;
}) {
  const [query, setQuery] = React.useState<string>("");

  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        minH={"100vh"}
        bgColor={"black"}
        direction={"column"}
        pt={"2rem"}
        alignItems={"center"}
      >
        <InputGroup w={"90%"} mb={4}>
          <InputLeftElement>
            <FaSearch />
          </InputLeftElement>
          <Input
            placeholder={"Seite suchen..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        {props.entries
          .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            } else if (a.title > b.title) {
              return 1;
            } else {
              return 0;
            }
          })
          .map((entry, i) => {
            return (
              <>
                <Button
                  rounded={"none"}
                  colorScheme={"gray"}
                  variant={"ghost"}
                  w={"100%"}
                  justifyContent={"flex-start"}
                  size={"lg"}
                  leftIcon={entry.icon as any}
                  fontSize={"2xl"}
                  onClick={entry.onClick}
                  disabled={
                    entry.disabled === undefined ? false : entry.disabled
                  }
                >
                  {entry.title}
                </Button>
              </>
            );
          })}
      </Flex>
    </>
  );
}
