/**
 * packages/components/global/GridLayoutV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.05.2024
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Grid,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { CHeading } from "./CHeading";

interface IButton {
  colorScheme?: string;
  variant?: string;
  text: string;
  leftIcon?: any;
  onClick: () => void;
  disabled?: boolean;
}

interface IField {
  icon?: any;
  text: string;
}

interface IProps {
  pageTitle: string;
  noTopBar?: boolean;
  search: {
    show: boolean;
    fields: boolean;
  };
  topButtons: IButton[];
  entries: {
    image?: string;
    title: string;
    buttonRows: IButton[][];
    fields: IField[];
  }[];
}

export default function GridLayoutV2(props: IProps) {
  const [query, setQuery] = React.useState("");
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        p={4}
        direction={["column", "row"]}
        gap={2}
        display={props.noTopBar ? "none" : "flex"}
      >
        <Box></Box>
        <CHeading>{props.pageTitle}</CHeading>
        <Flex
          gap={2}
          direction={["column", "row", "row"]}
          display={props.topButtons.length === 0 ? "none" : "flex"}
        >
          {props.topButtons.map((b) => {
            return (
              <>
                <Button
                  variant={b.variant}
                  colorScheme={b.colorScheme}
                  leftIcon={b.leftIcon}
                  onClick={b.onClick}
                  disabled={b.disabled}
                >
                  {b.text}
                </Button>
              </>
            );
          })}
        </Flex>
        {props.topButtons.length === 0 ? <Box></Box> : null}
      </Flex>
      {props.search.show && (
        <Flex justifyContent={"center"} mt={4} p={4}>
          <FormControl maxW={["100%", "100%", "25%"]}>
            <InputGroup>
              <InputLeftElement>
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder={"Suche"}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </InputGroup>
          </FormControl>
        </Flex>
      )}
      <Flex justifyContent={"center"}>
        <Grid
          templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
          gap={6}
          p={4}
          mt={"2rem"}
          maxW={["100%", "100%", "50%"]}
          w={"100%"}
        >
          {props.entries
            .filter((e) => {
              if (query === "") {
                return true;
              }
              if (props.search.fields) {
                for (const f of e.fields) {
                  if (f.text.toLowerCase().includes(query.toLowerCase())) {
                    return true;
                  }
                }
              }
              return e.title.toLowerCase().includes(query.toLowerCase());
            })
            .map((e) => {
              return (
                <>
                  <Box bg={"black"} rounded={"xl"} p={4} w={"100%"}>
                    {e.image && (
                      <Image
                        src={e.image}
                        w={"100%"}
                        objectFit={"contain"}
                        objectPosition={"center"}
                        borderRadius={"lg"}
                        h={"150px"}
                      />
                    )}
                    <CHeading size={"lg"}>{e.title}</CHeading>
                    <Stack
                      gap={3}
                      mt={e.fields.length > 0 ? 4 : 0}
                      mb={e.fields.length > 0 ? 4 : 0}
                    >
                      {e.fields.map((f) => {
                        return (
                          <>
                            <HStack alignItems={"center"} gap={4}>
                              {f.icon}
                              <Text fontSize={"lg"}>{f.text}</Text>
                            </HStack>
                          </>
                        );
                      })}
                    </Stack>
                    <Stack gap={2}>
                      {e.buttonRows.map((br) => {
                        return (
                          <>
                            <Flex
                              w={"100%"}
                              direction={["column", "row"]}
                              gap={2}
                              justifyContent={"space-between"}
                            >
                              {br.map((b) => {
                                return (
                                  <>
                                    <Button
                                      w={["100%", "100%", "45%"]}
                                      variant={b.variant}
                                      colorScheme={b.colorScheme}
                                      onClick={b.onClick}
                                      leftIcon={b.leftIcon}
                                      disabled={b.disabled}
                                    >
                                      {b.text}
                                    </Button>
                                  </>
                                );
                              })}
                            </Flex>
                          </>
                        );
                      })}
                    </Stack>
                  </Box>
                </>
              );
            })}
        </Grid>
      </Flex>
    </>
  );
}
