/**
 * packages/components/global/GridLayout.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.03.2023
 *
 */

import * as React from "react";
import { ReactNode } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import PopupManager from "@codeup/web/src/global/PopupManager";
import {
  FaClock,
  FaEye,
  FaPen,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

export default function GridLayout(props: {
  search?: {
    allow: boolean;
    searchFields: boolean;
  };
  specialEntries?: {
    icon: ReactNode;
    onClick: () => void;
  }[];
  entries?: {
    title: string;
    fields: {
      icon?: ReactNode;
      text: string;
    }[];
    buttonRows: {
      buttons: {
        text: string;
        onClick: () => void;
        colorScheme: string;
        icon?: ReactNode;
      }[];
    }[];
  }[];
}) {
  const [query, setQuery] = React.useState<string>("");

  return (
    <>
      {props.search?.allow && (
        <Flex justifyContent={"center"} mt={8}>
          <FormControl w={["75%", "25%"]}>
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
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
          "repeat(5, 1fr)",
        ]}
        gap={6}
        p={4}
        mt={"2rem"}
      >
        {props.specialEntries?.map((e, i) => {
          return (
            <>
              <GridItem
                key={"new"}
                bg={"gray.900"}
                p={"1rem"}
                borderRadius={"0.5rem"}
                _hover={{
                  cursor: "pointer",
                  borderColor: "blue.300",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onClick={e.onClick}
              >
                <Heading
                  fontSize={"8xl"}
                  textAlign={"center"}
                  color={"blue.300"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  display={"flex"}
                  h={"100%"}
                >
                  {e.icon}
                </Heading>
              </GridItem>
            </>
          );
        })}
        {props.entries
          ?.filter((e) => {
            if (query === "") {
              return true;
            } else {
              if (e.title.toLowerCase().includes(query.toLowerCase())) {
                return true;
              }
              if (props.search?.searchFields === false) {
                return false;
              }
              let found = false;
              e.fields.forEach((f) => {
                if (f.text.toLowerCase().includes(query.toLowerCase())) {
                  found = true;
                }
              });
              return found;
            }
          })
          .map((e, i) => {
            return (
              <GridItem
                key={i}
                bg={"gray.900"}
                p={"1rem"}
                borderRadius={"0.5rem"}
              >
                <Stack spacing={4}>
                  <Heading fontSize={"2xl"}>{e.title}</Heading>
                  {e.fields.map((f, j) => (
                    <>
                      <Text
                        fontSize={"xl"}
                        display={"flex"}
                        alignItems={"center"}
                        gap={3}
                      >
                        <Box>{f.icon}</Box>
                        {f.text}
                      </Text>
                    </>
                  ))}

                  {e.buttonRows.map((b, j) => {
                    return (
                      <ButtonGroup>
                        {b.buttons.map((c, k) => {
                          return (
                            <Button
                              colorScheme={c.colorScheme}
                              leftIcon={<>{c.icon}</>}
                              onClick={c.onClick}
                              w={"100%"}
                            >
                              {c.text}
                            </Button>
                          );
                        })}
                      </ButtonGroup>
                    );
                  })}
                </Stack>
              </GridItem>
            );
          })}
      </Grid>
    </>
  );
}
